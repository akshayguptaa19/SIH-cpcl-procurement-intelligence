import { Router } from 'express';
import BidApplication from '../models/BidApplication.js';
import Tender from '../models/Tender.js';
import Company from '../models/Company.js';
import VerificationCase from '../models/VerificationCase.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/applications
router.get('/', verifyToken, async (req, res) => {
  try {
    const { tenderId, status } = req.query;
    const filter = {};
    if (req.user.role === 'BIDDER') filter.bidder_id = req.user.id;
    if (tenderId) filter.tender_id = tenderId;
    if (status) filter.status = status;

    const applications = await BidApplication.find(filter).sort({ created_at: -1 }).lean();

    const enriched = await Promise.all(applications.map(async (app) => {
      const [tender, company, vc] = await Promise.all([
        Tender.findOne({ id: app.tender_id }, { reference_number: 1, title: 1, category: 1, submission_deadline: 1 }).lean(),
        Company.findOne({ id: app.company_id }, { name: 1, gstin: 1, pan: 1, is_msme: 1 }).lean(),
        VerificationCase.findOne({ application_id: app.id }, { id: 1, overall_status: 1, compliance_score: 1, risk_level: 1, risk_score: 1 }).lean()
      ]);
      return {
        ...app,
        tender_reference: tender?.reference_number,
        tender_title: tender?.title,
        tender_category: tender?.category,
        submission_deadline: tender?.submission_deadline,
        company_name: company?.name,
        gstin: company?.gstin,
        pan: company?.pan,
        is_msme: company?.is_msme,
        case_id: vc?.id,
        verification_status: vc?.overall_status,
        compliance_score: vc?.compliance_score,
        risk_level: vc?.risk_level,
        risk_score: vc?.risk_score
      };
    }));

    return res.json(enriched);
  } catch (err) {
    console.error('[Applications GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/applications/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const application = await BidApplication.findOne({ id: req.params.id }).lean();
    if (!application) return res.status(404).json({ error: 'Bid application not found' });

    if (req.user.role === 'BIDDER' && application.bidder_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You cannot view this application.' });
    }

    const [tender, company, vc] = await Promise.all([
      Tender.findOne({ id: application.tender_id }).lean(),
      Company.findOne({ id: application.company_id }).lean(),
      VerificationCase.findOne({ application_id: application.id }).lean()
    ]);
    const documents = await Document.find({ application_id: application.id }).sort({ uploaded_at: 1 }).lean();

    let riskAssessments = [];
    if (req.user.role === 'OFFICER' || req.user.role === 'ADMIN') {
      riskAssessments = vc?.risk_assessments || [];
    }

    return res.json({
      ...application,
      tender_reference: tender?.reference_number,
      tender_title: tender?.title,
      tender_category: tender?.category,
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
      case_id: vc?.id,
      verification_status: vc?.overall_status,
      compliance_score: vc?.compliance_score,
      risk_score: vc?.risk_score,
      risk_level: vc?.risk_level,
      rejection_reason: vc?.rejection_reason,
      officer_remarks: vc?.officer_remarks,
      assigned_officer_id: vc?.assigned_officer_id,
      documents,
      findings: vc?.findings || [],
      complianceChecks: vc?.checks || [],
      riskAssessments
    });
  } catch (err) {
    console.error('[Applications GET /:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/applications (Bidder applies to a tender)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'BIDDER') {
      return res.status(403).json({ error: 'Only registered bidder accounts can submit tender applications' });
    }

    const { tenderId, technicalRemarks } = req.body;
    if (!tenderId) return res.status(400).json({ error: 'Tender ID is required' });

    const tender = await Tender.findOne({ $or: [{ id: tenderId }, { reference_number: tenderId }, { tender_number: tenderId }] }).lean();
    if (!tender) return res.status(404).json({ error: 'Tender not found' });

    // Ensure bidder profile / company exists
    let userRecord = await User.findOne({ id: req.user.id }).lean();
    let companyId = userRecord?.bidder_profile?.company_id;

    if (!companyId) {
      companyId = `comp-${Date.now()}`;
      const companyName = req.user.name || 'Registered Enterprise';
      await Company.create({ id: companyId, legal_name: companyName, name: companyName, trade_name: companyName, gstin: '33AABCP9999Z1Z5', pan: 'AABCP9999Z', registration_number: 'U-REG-2026', msme_classification: 'Medium (Class-II)', is_msme: 1 });
      await User.updateOne({ id: req.user.id }, { $set: { bidder_profile: { company_id: companyId, authorized_person: req.user.name, verification_status: 'VERIFIED', blacklisted: false } } });
    }

    // Check duplicate
    const existing = await BidApplication.findOne({ tender_id: tender.id, bidder_id: req.user.id }).lean();
    if (existing) {
      return res.status(409).json({ error: 'Your enterprise has already submitted a bid for this tender', applicationId: existing.id });
    }

    const applicationId = `APP-${Date.now()}`;
    const caseId = `CASE-${Date.now()}`;
    const applicationNumber = `CPCL-BID-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    await BidApplication.create({ id: applicationId, tender_id: tender.id, bidder_id: req.user.id, company_id: companyId, application_number: applicationNumber, status: 'SUBMITTED', technical_remarks: technicalRemarks || 'Tender submission via sovereign portal', submitted_at: new Date() });
    await VerificationCase.create({ id: caseId, application_id: applicationId, tender_id: tender.id, bidder_id: req.user.id, company_id: companyId, overall_status: 'PENDING_REVIEW', compliance_score: 75.0, risk_score: 20.0, risk_level: 'LOW', officer_decision_status: 'PENDING' });

    await logAuditAction({ userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: 'BIDDER', action: 'BID_APPLICATION_SUBMITTED', entityType: 'BID_APPLICATION', entityId: applicationId, details: { applicationNumber, tenderRef: tender.reference_number } });
    await notifyRole({ role: 'OFFICER', type: 'VERIFICATION', title: `New Bid Submitted: ${applicationNumber}`, message: `Enterprise submitted bid for tender ${tender.reference_number}. Ready for verification review.`, relatedEntity: 'BID_APPLICATION', relatedId: applicationId });

    return res.status(201).json({ message: 'Bid application created successfully', applicationId, caseId, applicationNumber });
  } catch (err) {
    console.error('[Applications POST /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
