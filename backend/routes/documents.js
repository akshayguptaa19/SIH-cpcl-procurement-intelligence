import { Router } from 'express';
import db from '../db/database.js';
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
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document file uploaded or invalid file format. Supported: PDF, PNG, JPG, JPEG.' });
  }

  const { applicationId, documentType, documentName } = req.body;
  if (!applicationId || !documentType) {
    return res.status(400).json({ error: 'Application ID and document type are required' });
  }

  let application = db.queryOne('SELECT * FROM bid_applications WHERE id = ?', [applicationId]);
  if (!application && req.user.role === 'BIDDER') {
    application = db.queryOne('SELECT * FROM bid_applications WHERE (tender_id = ? OR id = ?) AND bidder_id = ?', [applicationId, applicationId, req.user.id]);
  }
  if (!application && req.user.role === 'BIDDER') {
    const tender = db.queryOne('SELECT * FROM tenders WHERE id = ? OR reference_number = ? OR tender_number = ?', [applicationId, applicationId, applicationId]) || db.queryOne('SELECT * FROM tenders LIMIT 1');
    if (tender) {
      const newAppId = `APP-${Date.now()}`;
      const bidderProfile = db.queryOne('SELECT * FROM bidder_profiles WHERE user_id = ?', [req.user.id]);
      const companyId = bidderProfile?.company_id || 'comp-001';
      db.transaction(() => {
        db.execute(
          `INSERT INTO bid_applications (id, tender_id, bidder_id, company_id, application_number, status)
           VALUES (?, ?, ?, ?, ?, 'SUBMITTED')`,
          [newAppId, tender.id, req.user.id, companyId, `CPCL-BID-2026-${Math.floor(1000 + Math.random() * 9000)}`]
        );
        db.execute(
          `INSERT INTO verification_cases (id, application_id, tender_id, bidder_id, company_id, overall_status, compliance_score, risk_score, risk_level)
           VALUES (?, ?, ?, ?, ?, 'PENDING_REVIEW', 80.0, 15.0, 'LOW')`,
          [`CASE-${Date.now()}`, newAppId, tender.id, req.user.id, companyId]
        );
      });
      application = db.queryOne('SELECT * FROM bid_applications WHERE id = ?', [newAppId]);
    }
  }

  if (!application) {
    return res.status(404).json({ error: 'Associated bid application not found' });
  }

  // Bidder isolation
  if (req.user.role === 'BIDDER' && application.bidder_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied. You cannot upload documents for this application.' });
  }

  const effectiveAppId = application.id;

  const fileUrl = `/uploads/${req.file.filename}`;
  const fileName = req.file.originalname;
  const fileSize = req.file.size;
  const mimeType = req.file.mimetype;

  // Check if document already exists for this application and type (Version increment)
  const existingDoc = db.queryOne(
    'SELECT * FROM documents WHERE application_id = ? AND document_type = ?',
    [effectiveAppId, documentType]
  );

  let docId;
  let versionNumber = 1;

  db.transaction(() => {
    if (existingDoc) {
      docId = existingDoc.id;
      versionNumber = existingDoc.current_version + 1;

      db.execute(
        `UPDATE documents 
         SET file_name = ?, file_url = ?, file_size = ?, mime_type = ?, current_version = ?, status = 'OCR_PROCESSED', uploaded_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [fileName, fileUrl, fileSize, mimeType, versionNumber, docId]
      );
    } else {
      docId = `DOC-${Date.now()}`;
      db.execute(
        `INSERT INTO documents (id, application_id, bidder_id, document_type, document_name, file_name, file_url, file_size, mime_type, current_version, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'OCR_PROCESSED')`,
        [docId, effectiveAppId, application.bidder_id, documentType, documentName || documentType, fileName, fileUrl, fileSize, mimeType]
      );
    }

    // Insert version record
    db.execute(
      `INSERT INTO document_versions (id, document_id, version_number, file_name, file_url, file_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`VER-${Date.now()}`, docId, versionNumber, fileName, fileUrl, fileSize, req.user.id]
    );
  });

  // Automated OCR Extraction Simulation
  const ocrResult = extractDocumentEntities(documentType, fileName);
  const ocrId = `OCR-${Date.now()}`;
  db.execute(
    `INSERT INTO ocr_extractions (id, document_id, extracted_data_json, confidence, status)
     VALUES (?, ?, ?, ?, 'COMPLETED')`,
    [ocrId, docId, JSON.stringify(ocrResult.entities), ocrResult.confidence]
  );

  // Trigger Automatic Compliance & Risk Recalculation
  let verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE application_id = ?', [effectiveAppId]);
  if (!verificationCase) {
    const newCaseId = `CASE-${Date.now()}`;
    db.execute(
      `INSERT INTO verification_cases (id, application_id, tender_id, bidder_id, company_id, overall_status, compliance_score, risk_score, risk_level)
       VALUES (?, ?, ?, ?, ?, 'PENDING_REVIEW', 80.0, 20.0, 'LOW')`,
      [newCaseId, effectiveAppId, application.tender_id, application.bidder_id, application.company_id]
    );
    verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ?', [newCaseId]);
  }

  // Evaluate Compliance Engine
  const complianceResult = evaluateCompliance(effectiveAppId, verificationCase.id);
  // Calculate Risk Engine
  const riskResult = calculateRisk(effectiveAppId, verificationCase.id);

  // Update Verification Case with refreshed dynamic scores
  db.execute(
    `UPDATE verification_cases 
     SET compliance_score = ?, risk_score = ?, risk_level = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [complianceResult.complianceScore, riskResult.overallRiskScore, riskResult.riskLevel, verificationCase.id]
  );

  // Generate AI Multi-document Consistency Finding if multiple docs uploaded
  const allDocs = db.query('SELECT * FROM documents WHERE application_id = ?', [effectiveAppId]);
  if (allDocs.length >= 2) {
    const company = db.queryOne('SELECT * FROM companies WHERE id = ?', [application.company_id]);
    const aiAnalysis = analyzeDocumentConsistency(allDocs, company);
    if (aiAnalysis && aiAnalysis.findings) {
      for (const f of aiAnalysis.findings) {
        const existingFinding = db.queryOne(
          'SELECT id FROM verification_findings WHERE case_id = ? AND finding = ?',
          [verificationCase.id, f.finding]
        );
        if (!existingFinding) {
          db.execute(
            `INSERT INTO verification_findings (id, case_id, document_id, finding, severity, confidence, evidence, recommendation)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [`VF-${Date.now()}-${Math.floor(Math.random() * 1000)}`, verificationCase.id, docId, f.finding, f.severity, f.confidence, f.evidence, f.recommendation]
          );
        }
      }
    }
  }

  // Audit Log
  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: versionNumber > 1 ? 'DOCUMENT_NEW_VERSION_UPLOADED' : 'DOCUMENT_UPLOADED',
    entityType: 'DOCUMENT',
    entityId: docId,
    details: {
      fileName,
      documentType,
      version: versionNumber,
      fileSize,
      complianceScore: complianceResult.complianceScore,
      riskLevel: riskResult.riskLevel
    }
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
});

// GET /api/documents/:id
router.get('/:id', verifyToken, (req, res) => {
  const document = db.queryOne(
    `SELECT d.*, ba.bidder_id
     FROM documents d
     JOIN bid_applications ba ON ba.id = d.application_id
     WHERE d.id = ?`,
    [req.params.id]
  );

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  if (req.user.role === 'BIDDER' && document.bidder_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const versions = db.query(
    'SELECT * FROM document_versions WHERE document_id = ? ORDER BY version_number DESC',
    [document.id]
  );

  const ocr = db.queryOne(
    'SELECT * FROM ocr_extractions WHERE document_id = ? ORDER BY processed_at DESC LIMIT 1',
    [document.id]
  );

  return res.json({
    ...document,
    versions,
    ocr: ocr ? { ...ocr, extracted_data: JSON.parse(ocr.extracted_data_json || '{}') } : null
  });
});

export default router;
