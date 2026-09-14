import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import Tender from '../models/Tender.js';
import BidApplication from '../models/BidApplication.js';
import Document from '../models/Document.js';
import VerificationCase from '../models/VerificationCase.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import upload from '../middleware/uploadMiddleware.js';
import { runAiAnalysis, getDefaultPortalResults } from '../services/aiEngineService.js';
import { logAuditAction } from '../services/auditService.js';
import { notifyRole } from '../services/notificationService.js';

const router = Router();

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.tif', '.tiff', '.bmp']);

function handleUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload validation failed'
      });
    }
    next();
  });
}

/**
 * POST /api/ai/analyze-file
 * Primary multipart upload entry point.
 * Upload document -> Backend -> AI Engine -> Clean JSON Result.
 */
router.post('/analyze-file', handleUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No bidder document uploaded. Please attach a valid PDF or image file (.pdf, .png, .jpg, .jpeg).'
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({
        success: false,
        error: `Unsupported file extension '${ext}'. Supported formats: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`
      });
    }

    // Resolve Tender Information
    let tenderTitle = req.body.tenderTitle || '';
    let tenderDescription = req.body.tenderDescription || '';
    const tenderId = req.body.tenderId || '';

    let tenderRecord = null;
    if (tenderId) {
      tenderRecord = await Tender.findOne({
        $or: [{ id: tenderId }, { reference_number: tenderId }, { tender_number: tenderId }]
      }).lean();
      if (tenderRecord) {
        if (!tenderTitle) tenderTitle = tenderRecord.title;
        if (!tenderDescription) tenderDescription = tenderRecord.description || tenderRecord.title;
      }
    }

    if (!tenderTitle) tenderTitle = 'General Procurement Tender (Statutory Compliance)';
    if (!tenderDescription) tenderDescription = 'Bidder shall submit valid GSTIN, PAN, and Udyam MSME registration. A declaration of no blacklisting is mandatory.';

    // Portal Verification Results
    let customPortalResults = null;
    if (req.body.portalResults) {
      try {
        customPortalResults = typeof req.body.portalResults === 'string'
          ? JSON.parse(req.body.portalResults)
          : req.body.portalResults;
      } catch (e) {
        console.warn('[AI Route] Failed to parse custom portalResults JSON, using defaults.');
      }
    }
    const portalResults = getDefaultPortalResults(customPortalResults);
    const runDocumentStructure = req.body.runDocumentStructure === 'true' || req.body.runDocumentStructure === true;

    // Invoke Python AI Engine
    let aiResult;
    try {
      aiResult = await runAiAnalysis({
        tenderTitle,
        tenderDescription,
        bidderDocumentPath: req.file.path,
        portalResults,
        runDocumentStructure
      });
    } catch (aiErr) {
      console.error('[AI Engine Execution Error]:', aiErr);
      return res.status(422).json({
        success: false,
        error: `AI analysis failed: ${aiErr.message}`,
        details: aiErr.details || null,
        file: { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype }
      });
    }

    const shouldSaveToDb = req.body.saveToDb !== 'false' && req.body.saveToDb !== false;
    let savedRecord = null;

    if (shouldSaveToDb) {
      const compliance = aiResult.compliance_assessment || {};
      const classification = aiResult.tender_classification || {};
      const ocr = aiResult.ocr || {};

      const appId = req.body.applicationId || `APP-${Date.now()}`;
      const caseId = `CASE-${Date.now()}`;
      const docId = `DOC-${Date.now()}`;

      // Resolve IDs from DB
      const firstTender = tenderRecord || await Tender.findOne({}).sort({ created_at: -1 }).lean();
      const firstBidder = await User.findOne({ role: 'BIDDER' }).lean() || await User.findOne({}).lean();
      const firstCompany = await Company.findOne({}).lean();

      const effectiveTenderId = tenderRecord?.id || tenderId || firstTender?.id;
      const companyId = req.body.companyId || firstCompany?.id;
      const bidderId = req.user?.id || req.body.bidderId || firstBidder?.id;

      const fileUrl = `/uploads/${req.file.filename}`;
      const fileName = req.file.originalname;
      const appNumber = `CPCL-AI-BID-${Date.now().toString().slice(-6)}`;

      // 1. Ensure or update BidApplication
      const existingApp = await BidApplication.findOne({ id: appId });
      if (!existingApp) {
        await BidApplication.create({
          id: appId,
          tender_id: effectiveTenderId,
          bidder_id: bidderId,
          company_id: companyId,
          application_number: appNumber,
          status: 'SUBMITTED',
          technical_remarks: 'Submitted via AI Bid Intelligence Pipeline',
          ai_recommendation: compliance.recommendation || null,
          ai_risk_level: compliance.risk_level || 'medium',
          ai_compliance_score: compliance.compliance_score || 0,
          tender_classification: classification.tender_type || 'works',
          submitted_at: new Date()
        });
      } else {
        await BidApplication.updateOne({ id: appId }, {
          $set: {
            ai_recommendation: compliance.recommendation || null,
            ai_risk_level: compliance.risk_level || 'medium',
            ai_compliance_score: compliance.compliance_score || 0,
            tender_classification: classification.tender_type || 'works'
          }
        });
      }

      // 2. Document record
      await Document.create({
        id: docId,
        application_id: appId,
        bidder_id: bidderId,
        document_type: req.body.documentType || 'BIDDER_SUBMISSION',
        document_name: req.body.documentName || fileName,
        file_name: fileName,
        file_url: fileUrl,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        current_version: 1,
        status: 'OCR_PROCESSED',
        ocr_full_text: ocr.full_text || '',
        uploaded_at: new Date(),
        ocr: {
          id: `OCR-${Date.now()}`,
          extracted_data: compliance.extracted_fields || {},
          confidence: 0.96,
          status: 'COMPLETED',
          processed_at: new Date()
        }
      });

      // 3. Verification case record
      const existingCase = await VerificationCase.findOne({ application_id: appId });
      const effectiveCaseId = existingCase ? existingCase.id : caseId;

      if (!existingCase) {
        await VerificationCase.create({
          id: caseId,
          application_id: appId,
          tender_id: effectiveTenderId,
          bidder_id: bidderId,
          company_id: companyId,
          overall_status: 'PENDING_REVIEW',
          compliance_score: compliance.compliance_score || 0,
          risk_score: compliance.risk_level === 'high' ? 80 : (compliance.risk_level === 'medium' ? 45 : 15),
          risk_level: (compliance.risk_level || 'low').toUpperCase(),
          ai_recommendation: compliance.recommendation || null,
          officer_decision_status: 'PENDING',
          officer_decision_notes: null
        });
      } else {
        await VerificationCase.updateOne({ id: existingCase.id }, {
          $set: {
            compliance_score: compliance.compliance_score || 0,
            risk_score: compliance.risk_level === 'high' ? 80 : (compliance.risk_level === 'medium' ? 45 : 15),
            risk_level: (compliance.risk_level || 'low').toUpperCase(),
            ai_recommendation: compliance.recommendation || null
          }
        });
      }

      // 4. Findings from failed compliance checks
      const checks = compliance.checks || [];
      const failedFindings = checks
        .filter(check => check.status === 'fail' || check.status === 'missing' || check.requirement === 'gstin_pan_consistency')
        .map(check => ({
          id: `VF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          document_id: docId,
          finding: `Statutory check [${check.requirement}]: ${check.status.toUpperCase()}`,
          severity: check.status === 'fail' ? 'HIGH' : (check.status === 'missing' ? 'MEDIUM' : 'INFO'),
          confidence: 95.0,
          evidence: check.evidence || 'Analyzed by CPCL AI Compliance Engine',
          recommendation: compliance.recommendation || 'Review check outcome before qualification'
        }));

      if (failedFindings.length > 0) {
        await VerificationCase.updateOne({ id: effectiveCaseId }, { $push: { findings: { $each: failedFindings } } });
      }

      savedRecord = { applicationId: appId, caseId: effectiveCaseId, documentId: docId, applicationNumber: appNumber };

      // Audit log
      await logAuditAction({
        userId: req.user?.id || 'SYSTEM_AI',
        userName: req.user?.full_name || req.user?.name || 'AI Engine Pipeline',
        userRole: req.user?.role || 'SYSTEM',
        action: 'AI_BID_DOCUMENT_ANALYZED',
        entityType: 'BID_APPLICATION',
        entityId: appId,
        details: { fileName, complianceScore: compliance.compliance_score, riskLevel: compliance.risk_level, tenderClassification: classification.tender_type }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Document analyzed through AI compliance engine successfully',
      file: {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      },
      ai_result: aiResult,
      portal_results: portalResults,
      database_record: savedRecord,
      applicationId: savedRecord?.applicationId || null,
      officer_decision: {
        status: 'PENDING',
        officer_remarks: null,
        decided_at: null,
        audit_note: 'The final qualification decision is made by the Procurement Officer independently of the AI recommendation.'
      }
    });

  } catch (error) {
    console.error('[AI Analyze File Route Unexpected Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error processing AI analysis',
      referenceCode: `ERR-AI-${Date.now()}`
    });
  }
});

/**
 * POST /api/ai/analyze-bid
 * JSON payload entry point (for pre-uploaded documents or text).
 */
router.post('/analyze-bid', async (req, res) => {
  try {
    const { tenderTitle, tenderDescription, bidderDocumentPath, portalResults, runDocumentStructure } = req.body;

    if (!bidderDocumentPath) {
      return res.status(400).json({ success: false, error: 'bidderDocumentPath is required' });
    }

    const effectivePortalResults = getDefaultPortalResults(portalResults);

    const aiResult = await runAiAnalysis({
      tenderTitle: tenderTitle || '',
      tenderDescription: tenderDescription || '',
      bidderDocumentPath,
      portalResults: effectivePortalResults,
      runDocumentStructure: Boolean(runDocumentStructure)
    });

    return res.json({ success: true, ai_result: aiResult, portal_results: effectivePortalResults });
  } catch (err) {
    return res.status(422).json({ success: false, error: err.message || 'AI bid analysis failed' });
  }
});

/**
 * GET /api/ai/bids/:applicationId
 * Fetch full AI evaluation and separated officer decision for an application.
 */
router.get('/bids/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const app = await BidApplication.findOne({
      $or: [{ id: applicationId }, { application_number: applicationId }]
    }).lean();

    if (!app) return res.status(404).json({ success: false, error: 'Application not found' });

    const [tender, company, vCase, docs] = await Promise.all([
      Tender.findOne({ id: app.tender_id }, { title: 1, reference_number: 1 }).lean(),
      Company.findOne({ id: app.company_id }, { name: 1, gstin: 1, pan: 1 }).lean(),
      VerificationCase.findOne({ application_id: app.id }).lean(),
      Document.find({ application_id: app.id }).sort({ uploaded_at: -1 }).lean()
    ]);

    return res.json({
      success: true,
      application: { ...app, tender_title: tender?.title, tender_ref: tender?.reference_number, company_name: company?.name, gstin: company?.gstin, pan: company?.pan },
      verification_case: vCase,
      documents: docs,
      findings: vCase?.findings || [],
      ai_recommendation: {
        recommendation: app.ai_recommendation || vCase?.ai_recommendation,
        risk_level: app.ai_risk_level || vCase?.risk_level,
        compliance_score: app.ai_compliance_score ?? vCase?.compliance_score,
        tender_classification: app.tender_classification
      },
      officer_decision: {
        status: vCase?.officer_decision_status || 'PENDING',
        notes: vCase?.officer_decision_notes || null,
        decided_at: vCase?.officer_decision_at || null,
        assigned_officer: vCase?.assigned_officer_id || null
      }
    });
  } catch (err) {
    console.error('[AI GET /bids/:applicationId]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/ai/bids/:applicationId/officer-decision
 * Store the final Procurement Officer decision separately from the AI recommendation.
 */
router.post('/bids/:applicationId/officer-decision', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { decision, notes, officerId } = req.body;

    if (!decision || !['QUALIFIED', 'REJECTED', 'CLARIFICATION_REQUIRED', 'ESCALATED'].includes(decision.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: "Invalid decision. Must be one of: 'QUALIFIED', 'REJECTED', 'CLARIFICATION_REQUIRED', 'ESCALATED'"
      });
    }

    const app = await BidApplication.findOne({ id: applicationId });
    if (!app) return res.status(404).json({ success: false, error: 'Application not found' });

    const normalizedDecision = decision.toUpperCase();
    const now = new Date();

    // Resolve officer ID
    let effectiveOfficerId = null;
    if (officerId) {
      const officerExists = await User.findOne({ id: officerId });
      if (officerExists) effectiveOfficerId = officerId;
    }
    if (!effectiveOfficerId && req.user?.id) {
      const me = await User.findOne({ id: req.user.id });
      if (me) effectiveOfficerId = req.user.id;
    }
    if (!effectiveOfficerId) {
      const defaultOfficer = await User.findOne({ role: { $in: ['PROCUREMENT_OFFICER', 'ADMIN'] } }).lean();
      effectiveOfficerId = defaultOfficer?.id || null;
    }

    const newCaseStatus = normalizedDecision === 'QUALIFIED' ? 'APPROVED' : (normalizedDecision === 'REJECTED' ? 'REJECTED' : 'PENDING_REVIEW');
    const newAppStatus = normalizedDecision === 'QUALIFIED' ? 'QUALIFIED' : (normalizedDecision === 'REJECTED' ? 'REJECTED' : 'SUBMITTED');

    await VerificationCase.updateOne({ application_id: applicationId }, {
      $set: {
        officer_decision_status: normalizedDecision,
        officer_decision_notes: notes || '',
        officer_decision_at: now,
        overall_status: newCaseStatus,
        assigned_officer_id: effectiveOfficerId
      }
    });

    await BidApplication.updateOne({ id: applicationId }, { $set: { status: newAppStatus } });

    await logAuditAction({
      userId: effectiveOfficerId || 'OFFICER-001',
      userName: req.user?.full_name || req.user?.name || 'Procurement Officer',
      userRole: req.user?.role || 'OFFICER',
      action: 'OFFICER_FINAL_DECISION_RECORDED',
      entityType: 'BID_APPLICATION',
      entityId: applicationId,
      details: { decision: normalizedDecision, notes }
    });

    return res.json({
      success: true,
      message: 'Procurement Officer final decision recorded successfully',
      decision: normalizedDecision,
      notes,
      decided_at: now.toISOString()
    });
  } catch (err) {
    console.error('[AI POST /bids/:applicationId/officer-decision]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
