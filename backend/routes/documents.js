import { Router } from 'express';
import Document from '../models/Document.js';
import BidApplication from '../models/BidApplication.js';
import Tender from '../models/Tender.js';
import Company from '../models/Company.js';
import VerificationCase from '../models/VerificationCase.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { extractDocumentEntities } from '../services/ocrService.js';
import { evaluateCompliance } from '../services/complianceEngine.js';
import { calculateRisk } from '../services/riskEngine.js';
import { analyzeDocumentConsistency } from '../services/aiVerificationService.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification, notifyRole } from '../services/notificationService.js';

const router = Router();

// POST /api/documents/upload
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file uploaded or invalid file format. Supported: PDF, PNG, JPG, JPEG.' });
    }

    const { applicationId, documentType, documentName } = req.body;
    if (!applicationId || !documentType) {
      return res.status(400).json({ error: 'Application ID and document type are required' });
    }

    // Resolve or create application
    let application = await BidApplication.findOne({ id: applicationId }).lean();

    if (!application && req.user.role === 'BIDDER') {
      application = await BidApplication.findOne({
        $or: [{ tender_id: applicationId }, { id: applicationId }],
        bidder_id: req.user.id
      }).lean();
    }

    if (!application && req.user.role === 'BIDDER') {
      // Auto-create application for first upload
      const tender = await Tender.findOne({
        $or: [{ id: applicationId }, { reference_number: applicationId }, { tender_number: applicationId }]
      }).lean() || await Tender.findOne({}).sort({ created_at: -1 }).lean();

      if (tender) {
        const newAppId = `APP-${Date.now()}`;
        const userRecord = await User.findOne({ id: req.user.id }).lean();
        const companyId = userRecord?.bidder_profile?.company_id || 'comp-001';
        await BidApplication.create({ id: newAppId, tender_id: tender.id, bidder_id: req.user.id, company_id: companyId, application_number: `CPCL-BID-2026-${Math.floor(1000 + Math.random() * 9000)}`, status: 'SUBMITTED', submitted_at: new Date() });
        await VerificationCase.create({ id: `CASE-${Date.now()}`, application_id: newAppId, tender_id: tender.id, bidder_id: req.user.id, company_id: companyId, overall_status: 'PENDING_REVIEW', compliance_score: 80.0, risk_score: 15.0, risk_level: 'LOW', officer_decision_status: 'PENDING' });
        application = await BidApplication.findOne({ id: newAppId }).lean();
      }
    }

    if (!application) return res.status(404).json({ error: 'Associated bid application not found' });
    if (req.user.role === 'BIDDER' && application.bidder_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You cannot upload documents for this application.' });
    }

    const effectiveAppId = application.id;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // Check version
    const existingDoc = await Document.findOne({ application_id: effectiveAppId, document_type: documentType });
    let docId;
    let versionNumber = 1;

    if (existingDoc) {
      docId = existingDoc.id;
      versionNumber = existingDoc.current_version + 1;
      existingDoc.file_name = fileName;
      existingDoc.file_url = fileUrl;
      existingDoc.file_size = fileSize;
      existingDoc.mime_type = mimeType;
      existingDoc.current_version = versionNumber;
      existingDoc.status = 'OCR_PROCESSED';
      existingDoc.uploaded_at = new Date();
      existingDoc.versions.push({ id: `VER-${Date.now()}`, version_number: versionNumber, file_name: fileName, file_url: fileUrl, file_size: fileSize, uploaded_by: req.user.id, uploaded_at: new Date() });
      await existingDoc.save();
    } else {
      docId = `DOC-${Date.now()}`;
      await Document.create({
        id: docId,
        application_id: effectiveAppId,
        bidder_id: application.bidder_id,
        document_type: documentType,
        document_name: documentName || documentType,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: mimeType,
        current_version: 1,
        status: 'OCR_PROCESSED',
        uploaded_at: new Date(),
        versions: [{ id: `VER-${Date.now()}`, version_number: 1, file_name: fileName, file_url: fileUrl, file_size: fileSize, uploaded_by: req.user.id, uploaded_at: new Date() }]
      });
    }

    // Automated OCR Extraction
    const ocrResult = extractDocumentEntities(documentType, fileName);
    await Document.updateOne({ id: docId }, {
      $set: {
        ocr: { id: `OCR-${Date.now()}`, extracted_data: ocrResult.entities, confidence: ocrResult.confidence, status: 'COMPLETED', processed_at: new Date() }
      }
    });

    // Trigger Compliance & Risk
    let verificationCase = await VerificationCase.findOne({ application_id: effectiveAppId });
    if (!verificationCase) {
      verificationCase = await VerificationCase.create({ id: `CASE-${Date.now()}`, application_id: effectiveAppId, tender_id: application.tender_id, bidder_id: application.bidder_id, company_id: application.company_id, overall_status: 'PENDING_REVIEW', compliance_score: 80.0, risk_score: 20.0, risk_level: 'LOW', officer_decision_status: 'PENDING' });
    }

    const complianceResult = evaluateCompliance(effectiveAppId, verificationCase.id);
    const riskResult = calculateRisk(effectiveAppId, verificationCase.id);

    await VerificationCase.updateOne({ id: verificationCase.id }, {
      $set: { compliance_score: complianceResult.complianceScore, risk_score: riskResult.overallRiskScore, risk_level: riskResult.riskLevel }
    });

    // AI Multi-document consistency finding
    const allDocs = await Document.find({ application_id: effectiveAppId }).lean();
    if (allDocs.length >= 2) {
      const company = await Company.findOne({ id: application.company_id }).lean();
      const aiAnalysis = analyzeDocumentConsistency(allDocs, company);
      if (aiAnalysis && aiAnalysis.findings) {
        for (const f of aiAnalysis.findings) {
          const existingFinding = verificationCase.findings?.find(vf => vf.finding === f.finding);
          if (!existingFinding) {
            await VerificationCase.updateOne({ id: verificationCase.id }, {
              $push: { findings: { id: `VF-${Date.now()}-${Math.floor(Math.random() * 1000)}`, document_id: docId, finding: f.finding, severity: f.severity, confidence: f.confidence, evidence: f.evidence, recommendation: f.recommendation } }
            });
          }
        }
      }
    }

    await logAuditAction({
      userId: req.user.id,
      userName: req.user.full_name || req.user.name,
      userRole: req.user.role,
      action: versionNumber > 1 ? 'DOCUMENT_NEW_VERSION_UPLOADED' : 'DOCUMENT_UPLOADED',
      entityType: 'DOCUMENT',
      entityId: docId,
      details: { fileName, documentType, version: versionNumber, fileSize, complianceScore: complianceResult.complianceScore, riskLevel: riskResult.riskLevel }
    });

    return res.status(201).json({
      message: 'Document uploaded and AI verification cycle completed',
      documentId: docId,
      id: docId,
      version: versionNumber,
      fileUrl,
      ocr: ocrResult,
      ocrExtraction: ocrResult,
      complianceScore: complianceResult.complianceScore,
      compliance: complianceResult,
      riskLevel: riskResult.riskLevel,
      risk: riskResult
    });
  } catch (err) {
    console.error('[Documents POST /upload]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/documents
router.get('/', verifyToken, async (req, res) => {
  try {
    const { applicationId, bidderId, documentType } = req.query;
    const filter = {};

    if (applicationId) filter.application_id = applicationId;
    if (documentType) filter.document_type = documentType;

    if (req.user.role === 'BIDDER') {
      filter.bidder_id = req.user.id;
    } else if (bidderId) {
      filter.bidder_id = bidderId;
    }

    const docs = await Document.find(filter).sort({ uploaded_at: -1 }).lean();
    return res.json(docs);
  } catch (err) {
    console.error('[Documents GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/documents/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({ id: req.params.id }).lean();
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const app = await BidApplication.findOne({ id: document.application_id }, { bidder_id: 1 }).lean();
    if (req.user.role === 'BIDDER' && app?.bidder_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({
      ...document,
      versions: document.versions || [],
      ocr: document.ocr ? { ...document.ocr, extracted_data: document.ocr.extracted_data } : null
    });
  } catch (err) {
    console.error('[Documents GET /:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
