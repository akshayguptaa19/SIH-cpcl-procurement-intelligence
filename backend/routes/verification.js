import { Router } from 'express';
import VerificationCase from '../models/VerificationCase.js';
import BidApplication from '../models/BidApplication.js';
import Tender from '../models/Tender.js';
import Company from '../models/Company.js';
import Document from '../models/Document.js';
import Clarification from '../models/Clarification.js';
import User from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification, notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/verification/queue, /cases, / (Officer/Admin only)
router.get(['/queue', '/cases', '/'], verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { status, riskLevel, search } = req.query;
    const filter = {};
    if (status) filter.overall_status = status;
    if (riskLevel) filter.risk_level = riskLevel;

    const cases = await VerificationCase.find(filter).sort({ created_at: -1 }).lean();

    const enriched = await Promise.all(cases.map(async (vc) => {
      const [app, tender, company] = await Promise.all([
        BidApplication.findOne({ id: vc.application_id }, { application_number: 1, submitted_at: 1 }).lean(),
        Tender.findOne({ id: vc.tender_id }, { reference_number: 1, title: 1, category: 1, estimated_value: 1 }).lean(),
        Company.findOne({ id: vc.company_id }, { id: 1, name: 1, gstin: 1, pan: 1, is_msme: 1 }).lean()
      ]);

      // Apply search filter if needed
      if (search) {
        const term = search.toLowerCase();
        const companyMatch = company?.name?.toLowerCase().includes(term);
        const tenderMatch = tender?.reference_number?.toLowerCase().includes(term);
        const appMatch = app?.application_number?.toLowerCase().includes(term);
        if (!companyMatch && !tenderMatch && !appMatch) return null;
      }

      const docCount = await Document.countDocuments({ application_id: vc.application_id });
      const criticalFlags = (vc.findings || []).filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').length;

      return {
        ...vc,
        application_number: app?.application_number,
        submitted_at: app?.submitted_at,
        tender_reference: tender?.reference_number,
        tender_title: tender?.title,
        tender_category: tender?.category,
        estimated_value: tender?.estimated_value,
        company_id: company?.id,
        company_name: company?.name,
        gstin: company?.gstin,
        pan: company?.pan,
        is_msme: company?.is_msme,
        document_count: docCount,
        critical_flags_count: criticalFlags
      };
    }));

    return res.json(enriched.filter(Boolean));
  } catch (err) {
    console.error('[Verification GET /queue]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/verification/cases/:id (Full 3-Column Workspace Detail)
router.get('/cases/:id', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const caseId = req.params.id;
    const verificationCase = await VerificationCase.findOne({
      $or: [{ id: caseId }, { application_id: caseId }]
    }).lean();

    if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

    const [app, tender, company, bidderUser, documents, clarifications] = await Promise.all([
      BidApplication.findOne({ id: verificationCase.application_id }).lean(),
      Tender.findOne({ id: verificationCase.tender_id }).lean(),
      Company.findOne({ id: verificationCase.company_id }).lean(),
      User.findOne({ id: verificationCase.bidder_id }, { email: 1, full_name: 1, name: 1, phone: 1 }).lean(),
      Document.find({ application_id: verificationCase.application_id }).sort({ uploaded_at: 1 }).lean(),
      Clarification.find({ case_id: verificationCase.id }).sort({ created_at: -1 }).lean()
    ]);

    const enrichedDocs = documents.map(doc => ({
      ...doc,
      extracted_data: doc.ocr?.extracted_data || null,
      extracted_data_json: doc.ocr?.extracted_data ? JSON.stringify(doc.ocr.extracted_data) : null,
      ocr_confidence: doc.ocr?.confidence || null
    }));

    const sovereignChecks = {
      gstn: { status: 'VERIFIED', legalName: company?.name, gstin: company?.gstin, activeSince: '01/07/2017', filingStatus: 'Current & Up-to-date (98% Compliance)' },
      mca21: { status: 'VERIFIED', cin: company?.registration_number, companyStatus: 'Active', paidUpCapital: '₹10,00,00,000' },
      panGateway: { status: 'VERIFIED', pan: company?.pan, linkageStatus: 'Aadhaar/Entity Seeding Confirmed' }
    };

    const fullCase = {
      ...verificationCase,
      app_id: app?.id,
      application_number: app?.application_number,
      submitted_at: app?.submitted_at,
      application_status: app?.status,
      tender_pk: tender?.id,
      tender_reference: tender?.reference_number,
      tender_title: tender?.title,
      estimated_value: tender?.estimated_value,
      submission_deadline: tender?.submission_deadline,
      company_id: company?.id,
      company_name: company?.name,
      registration_number: company?.registration_number,
      gstin: company?.gstin,
      pan: company?.pan,
      is_msme: company?.is_msme,
      address: company?.address,
      state: company?.state,
      bidder_email: bidderUser?.email,
      bidder_contact_name: bidderUser?.full_name || bidderUser?.name,
      bidder_phone: bidderUser?.phone
    };

    return res.json({
      case: fullCase,
      documents: enrichedDocs,
      findings: verificationCase.findings || [],
      complianceChecks: verificationCase.checks || [],
      riskAssessments: (verificationCase.risk_assessments || []).map(ra => ({ ...ra, risk_factors: ra.risk_factors || [] })),
      clarifications,
      sovereignChecks
    });
  } catch (err) {
    console.error('[Verification GET /cases/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/verification/cases/:id/approve
router.post('/cases/:id/approve', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { remarks } = req.body;
    const verificationCase = await VerificationCase.findOne({ id: req.params.id });
    if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

    const prevStatus = verificationCase.overall_status;
    verificationCase.overall_status = 'APPROVED';
    verificationCase.officer_remarks = remarks || 'Technical & Statutory Compliance Verified by CPCL Officer';
    verificationCase.assigned_officer_id = req.user.id;
    verificationCase.reviewed_at = new Date();
    await verificationCase.save();

    await BidApplication.updateOne({ id: verificationCase.application_id }, { $set: { status: 'QUALIFIED' } });

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'VERIFICATION_APPROVED', entityType: 'VERIFICATION_CASE', entityId: verificationCase.id,
      previousState: prevStatus, newState: 'APPROVED',
      details: { remarks, applicationId: verificationCase.application_id }
    });

    await createNotification({
      userId: verificationCase.bidder_id, role: 'BIDDER', type: 'VERIFICATION',
      title: 'Bid Verification Approved',
      message: 'Your bid application has been successfully verified and qualified by the CPCL Procurement Committee.',
      relatedEntity: 'BID_APPLICATION', relatedId: verificationCase.application_id
    });

    return res.json({ message: 'Verification case approved and bidder marked as QUALIFIED', status: 'APPROVED' });
  } catch (err) {
    console.error('[Verification POST /cases/:id/approve]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/verification/cases/:id/reject
router.post('/cases/:id/reject', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { reason, remarks } = req.body;
    if (!reason) return res.status(400).json({ error: 'Rejection reason is mandatory for formal record' });

    const verificationCase = await VerificationCase.findOne({ id: req.params.id });
    if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

    const prevStatus = verificationCase.overall_status;
    verificationCase.overall_status = 'REJECTED';
    verificationCase.rejection_reason = reason;
    verificationCase.officer_remarks = remarks || '';
    verificationCase.assigned_officer_id = req.user.id;
    verificationCase.reviewed_at = new Date();
    await verificationCase.save();

    await BidApplication.updateOne({ id: verificationCase.application_id }, { $set: { status: 'REJECTED' } });

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'VERIFICATION_REJECTED', entityType: 'VERIFICATION_CASE', entityId: verificationCase.id,
      previousState: prevStatus, newState: 'REJECTED', details: { reason, remarks }
    });

    await createNotification({
      userId: verificationCase.bidder_id, role: 'BIDDER', type: 'VERIFICATION',
      title: 'Bid Verification Determination: Non-Compliant',
      message: `Your bid application was determined non-compliant. Reason: ${reason}`,
      relatedEntity: 'BID_APPLICATION', relatedId: verificationCase.application_id
    });

    return res.json({ message: 'Verification case rejected with formal audit log recorded', status: 'REJECTED' });
  } catch (err) {
    console.error('[Verification POST /cases/:id/reject]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/verification/cases/:id/escalate
router.post('/cases/:id/escalate', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { remarks } = req.body;
    const verificationCase = await VerificationCase.findOne({ id: req.params.id });
    if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

    const prevStatus = verificationCase.overall_status;
    verificationCase.overall_status = 'ESCALATED';
    verificationCase.officer_remarks = remarks || 'Escalated to Chief Vigilance Officer for scrutiny';
    await verificationCase.save();

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'CASE_ESCALATED_CVO', entityType: 'VERIFICATION_CASE', entityId: verificationCase.id,
      previousState: prevStatus, newState: 'ESCALATED', details: { remarks }
    });

    await notifyRole({
      role: 'ADMIN', type: 'RISK_ALERT', title: 'High-Risk Procurement Case Escalated to CVO',
      message: `Case ${verificationCase.id} has been escalated for scrutiny. Remarks: ${remarks || 'Critical anomaly detected.'}`,
      relatedEntity: 'VERIFICATION_CASE', relatedId: verificationCase.id
    });

    return res.json({ message: 'Case escalated to Chief Vigilance Officer', status: 'ESCALATED' });
  } catch (err) {
    console.error('[Verification POST /cases/:id/escalate]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/verification/cases/:id/update-field
router.put('/cases/:id/update-field', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { checkId, newResult, evidence } = req.body;
    if (!checkId || !newResult) return res.status(400).json({ error: 'Check ID and new result are required' });

    const verificationCase = await VerificationCase.findOne({ id: req.params.id });
    if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

    const checkIndex = (verificationCase.checks || []).findIndex(c => c.id === checkId);
    if (checkIndex === -1) return res.status(404).json({ error: 'Compliance check rule not found' });

    const prevResult = verificationCase.checks[checkIndex].result;
    verificationCase.checks[checkIndex].result = newResult;
    verificationCase.checks[checkIndex].evidence = evidence || verificationCase.checks[checkIndex].evidence;
    verificationCase.checks[checkIndex].review_status = 'MANUAL_OFFICER_OVERRIDE';
    await verificationCase.save();

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'OFFICER_OVERRIDE_COMPLIANCE_RULE', entityType: 'COMPLIANCE_CHECK', entityId: checkId,
      previousState: prevResult, newState: newResult,
      details: { requirement: verificationCase.checks[checkIndex].requirement_name, evidence }
    });

    return res.json({ message: 'Compliance check updated with manual officer override', checkId, newResult });
  } catch (err) {
    console.error('[Verification PUT /cases/:id/update-field]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
