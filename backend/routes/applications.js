import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/applications
router.get('/', verifyToken, (req, res) => {
  const { tenderId, status } = req.query;

  let query = `
    SELECT 
      ba.*,
      t.reference_number AS tender_reference,
      t.title AS tender_title,
      t.category AS tender_category,
      t.submission_deadline,
      c.name AS company_name,
      c.gstin,
      c.pan,
      c.is_msme,
      vc.id AS case_id,
      vc.overall_status AS verification_status,
      vc.compliance_score,
      vc.risk_level,
      vc.risk_score
    FROM bid_applications ba
    JOIN tenders t ON t.id = ba.tender_id
    JOIN companies c ON c.id = ba.company_id
    LEFT JOIN verification_cases vc ON vc.application_id = ba.id
    WHERE 1=1
  `;
  const params = [];

  // Strict Bidder Isolation: Bidders only see their own bids
  if (req.user.role === 'BIDDER') {
    query += ' AND ba.bidder_id = ?';
    params.push(req.user.id);
  }

  if (tenderId) {
    query += ' AND ba.tender_id = ?';
    params.push(tenderId);
  }
  if (status) {
    query += ' AND ba.status = ?';
    params.push(status);
  }

  query += ' ORDER BY ba.created_at DESC';

  const applications = db.query(query, params);
  return res.json(applications);
});

// GET /api/applications/:id
router.get('/:id', verifyToken, (req, res) => {
  const application = db.queryOne(
    `SELECT 
       ba.*,
       t.reference_number AS tender_reference,
       t.title AS tender_title,
       t.category AS tender_category,
       t.estimated_value,
       t.submission_deadline,
       c.id AS company_id,
       c.name AS company_name,
       c.registration_number,
       c.gstin,
       c.pan,
       c.is_msme,
       c.address,
       c.state,
       vc.id AS case_id,
       vc.overall_status AS verification_status,
       vc.compliance_score,
       vc.risk_score,
       vc.risk_level,
       vc.rejection_reason,
       vc.officer_remarks,
       vc.assigned_officer_id
     FROM bid_applications ba
     JOIN tenders t ON t.id = ba.tender_id
     JOIN companies c ON c.id = ba.company_id
     LEFT JOIN verification_cases vc ON vc.application_id = ba.id
     WHERE ba.id = ?`,
    [req.params.id]
  );

  if (!application) {
    return res.status(404).json({ error: 'Bid application not found' });
  }

  // Strict Bidder Isolation
  if (req.user.role === 'BIDDER' && application.bidder_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied. You cannot view this application.' });
  }

  // Documents
  const documents = db.query(
    'SELECT * FROM documents WHERE application_id = ? ORDER BY uploaded_at ASC',
    [application.id]
  );

  // Verification Findings (if officer/admin, or filtered summary for bidder)
  let findings = [];
  if (application.case_id) {
    findings = db.query(
      'SELECT * FROM verification_findings WHERE case_id = ? ORDER BY created_at ASC',
      [application.case_id]
    );
  }

  // Compliance Checks
  const complianceChecks = db.query(
    'SELECT * FROM compliance_checks WHERE application_id = ? ORDER BY created_at ASC',
    [application.id]
  );

  // Risk Assessments (Hidden or summarized for Bidders to protect confidential scoring)
  let riskAssessments = [];
  if (req.user.role === 'OFFICER' || req.user.role === 'ADMIN') {
    riskAssessments = db.query(
      'SELECT * FROM risk_assessments WHERE application_id = ? ORDER BY created_at ASC',
      [application.id]
    );
  }

  return res.json({
    ...application,
    documents,
    findings,
    complianceChecks,
    riskAssessments
  });
});

// POST /api/applications (Bidder applies to a tender)
router.post('/', verifyToken, (req, res) => {
  if (req.user.role !== 'BIDDER') {
    return res.status(403).json({ error: 'Only registered bidder accounts can submit tender applications' });
  }

  const { tenderId, technicalRemarks } = req.body;
  if (!tenderId) {
    return res.status(400).json({ error: 'Tender ID is required' });
  }

  const tender = db.queryOne('SELECT * FROM tenders WHERE id = ? OR reference_number = ? OR tender_number = ?', [tenderId, tenderId, tenderId]);
  if (!tender) {
    return res.status(404).json({ error: 'Tender not found' });
  }

  let bidderProfile = db.queryOne('SELECT * FROM bidder_profiles WHERE user_id = ?', [req.user.id]);
  if (!bidderProfile) {
    const compId = `comp-${Date.now()}`;
    db.transaction(() => {
      db.execute(
        `INSERT OR IGNORE INTO companies (id, legal_name, name, trade_name, gstin, pan, registration_number, msme_classification, is_msme)
         VALUES (?, ?, ?, ?, '33AABCP9999Z1Z5', 'AABCP9999Z', 'U-REG-2026', 'Medium (Class-II)', 1)`,
        [compId, req.user.name || 'Registered Enterprise', req.user.name || 'Registered Enterprise', req.user.name || 'Registered Enterprise']
      );
      db.execute(
        `INSERT OR IGNORE INTO bidder_profiles (id, user_id, company_id, authorized_person, verification_status)
         VALUES (?, ?, ?, ?, 'VERIFIED')`,
        [`bp-${Date.now()}`, req.user.id, compId, req.user.name || 'Authorized Signatory']
      );
    });
    bidderProfile = db.queryOne('SELECT * FROM bidder_profiles WHERE user_id = ?', [req.user.id]);
  }

  // Check duplicate
  const existing = db.queryOne(
    'SELECT id FROM bid_applications WHERE tender_id = ? AND bidder_id = ?',
    [tender.id, req.user.id]
  );
  if (existing) {
    return res.status(409).json({ error: 'Your enterprise has already submitted a bid for this tender', applicationId: existing.id });
  }

  const applicationId = `APP-${Date.now()}`;
  const caseId = `CASE-${Date.now()}`;
  const applicationNumber = `CPCL-BID-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  db.transaction(() => {
    db.execute(
      `INSERT INTO bid_applications (id, tender_id, bidder_id, company_id, application_number, status, technical_remarks)
       VALUES (?, ?, ?, ?, ?, 'SUBMITTED', ?)`,
      [applicationId, tenderId, req.user.id, bidderProfile.company_id, applicationNumber, technicalRemarks || 'Tender submission via sovereign portal']
    );

    db.execute(
      `INSERT INTO verification_cases (id, application_id, tender_id, bidder_id, company_id, overall_status, compliance_score, risk_score, risk_level)
       VALUES (?, ?, ?, ?, ?, 'PENDING_REVIEW', 75.0, 20.0, 'LOW')`,
      [caseId, applicationId, tenderId, req.user.id, bidderProfile.company_id]
    );
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: 'BIDDER',
    action: 'BID_APPLICATION_SUBMITTED',
    entityType: 'BID_APPLICATION',
    entityId: applicationId,
    details: { applicationNumber, tenderRef: tender.reference_number }
  });

  notifyRole({
    role: 'OFFICER',
    type: 'VERIFICATION',
    title: `New Bid Submitted: ${applicationNumber}`,
    message: `Enterprise submitted bid for tender ${tender.reference_number}. Ready for verification review.`,
    relatedEntity: 'BID_APPLICATION',
    relatedId: applicationId
  });

  return res.status(201).json({
    message: 'Bid application created successfully',
    applicationId,
    caseId,
    applicationNumber
  });
});

export default router;
