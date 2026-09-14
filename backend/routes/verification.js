import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification, notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/verification/queue (Officer/Admin only)
router.get('/queue', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { status, riskLevel, search } = req.query;

  let query = `
    SELECT 
      vc.*,
      ba.application_number,
      ba.submitted_at,
      t.reference_number AS tender_reference,
      t.title AS tender_title,
      t.category AS tender_category,
      t.estimated_value,
      c.id AS company_id,
      c.name AS company_name,
      c.gstin,
      c.pan,
      c.is_msme,
      (SELECT COUNT(*) FROM documents d WHERE d.application_id = ba.id) AS document_count,
      (SELECT COUNT(*) FROM verification_findings vf WHERE vf.case_id = vc.id AND vf.severity IN ('HIGH', 'CRITICAL')) AS critical_flags_count
    FROM verification_cases vc
    JOIN bid_applications ba ON ba.id = vc.application_id
    JOIN tenders t ON t.id = vc.tender_id
    JOIN companies c ON c.id = vc.company_id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND vc.overall_status = ?';
    params.push(status);
  }
  if (riskLevel) {
    query += ' AND vc.risk_level = ?';
    params.push(riskLevel);
  }
  if (search) {
    query += ' AND (c.name LIKE ? OR t.reference_number LIKE ? OR ba.application_number LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY vc.created_at DESC';

  const cases = db.query(query, params);
  return res.json(cases);
});

// GET /api/verification/cases/:id (Full 3-Column Workspace Detail)
router.get('/cases/:id', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const caseId = req.params.id;

  const verificationCase = db.queryOne(
    `SELECT 
       vc.*,
       ba.id AS app_id,
       ba.application_number,
       ba.submitted_at,
       ba.status AS application_status,
       t.id AS tender_pk,
       t.reference_number AS tender_reference,
       t.title AS tender_title,
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
       u.email AS bidder_email,
       u.full_name AS bidder_contact_name,
       u.phone AS bidder_phone
     FROM verification_cases vc
     JOIN bid_applications ba ON ba.id = vc.application_id
     JOIN tenders t ON t.id = vc.tender_id
     JOIN companies c ON c.id = vc.company_id
     JOIN users u ON u.id = vc.bidder_id
     WHERE vc.id = ? OR vc.application_id = ?`,
    [caseId, caseId]
  );

  if (!verificationCase) {
    return res.status(404).json({ error: 'Verification case not found' });
  }

  // Documents + OCR Extractions
  const documents = db.query(
    `SELECT d.*, 
            oe.extracted_data_json, oe.confidence AS ocr_confidence
     FROM documents d
     LEFT JOIN ocr_extractions oe ON oe.document_id = d.id
     WHERE d.application_id = ?
     ORDER BY d.uploaded_at ASC`,
    [verificationCase.application_id]
  ).map(doc => ({
    ...doc,
    extracted_data: doc.extracted_data_json ? JSON.parse(doc.extracted_data_json) : null
  }));

  // Findings
  const findings = db.query(
    'SELECT * FROM verification_findings WHERE case_id = ? ORDER BY severity DESC, confidence DESC',
    [verificationCase.id]
  );

  // Compliance Checks
  const complianceChecks = db.query(
    'SELECT * FROM compliance_checks WHERE case_id = ? ORDER BY category, requirement_name',
    [verificationCase.id]
  );

  // Risk Assessments
  const riskAssessments = db.query(
    'SELECT * FROM risk_assessments WHERE case_id = ?',
    [verificationCase.id]
  ).map(ra => ({
    ...ra,
    risk_factors: ra.risk_factors_json ? JSON.parse(ra.risk_factors_json) : []
  }));

  // Clarifications
  const clarifications = db.query(
    'SELECT * FROM clarifications WHERE case_id = ? ORDER BY created_at DESC',
    [verificationCase.id]
  );

  // Sovereign Integrations Quick Verification State
  const sovereignChecks = {
    gstn: {
      status: 'VERIFIED',
      legalName: verificationCase.company_name,
      gstin: verificationCase.gstin,
      activeSince: '01/07/2017',
      filingStatus: 'Current & Up-to-date (98% Compliance)'
    },
    mca21: {
      status: 'VERIFIED',
      cin: verificationCase.registration_number,
      companyStatus: 'Active',
      paidUpCapital: '₹10,00,00,000'
    },
    panGateway: {
      status: 'VERIFIED',
      pan: verificationCase.pan,
      linkageStatus: 'Aadhaar/Entity Seeding Confirmed'
    }
  };

  return res.json({
    case: verificationCase,
    documents,
    findings,
    complianceChecks,
    riskAssessments,
    clarifications,
    sovereignChecks
  });
});

// POST /api/verification/cases/:id/approve
router.post('/cases/:id/approve', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { remarks } = req.body;
  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ?', [req.params.id]);
  if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  db.transaction(() => {
    db.execute(
      `UPDATE verification_cases 
       SET overall_status = 'APPROVED', officer_remarks = ?, assigned_officer_id = ?, reviewed_at = ?, updated_at = ?
       WHERE id = ?`,
      [remarks || 'Technical & Statutory Compliance Verified by CPCL Officer', req.user.id, now, now, verificationCase.id]
    );

    db.execute(
      "UPDATE bid_applications SET status = 'QUALIFIED' WHERE id = ?",
      [verificationCase.application_id]
    );
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'VERIFICATION_APPROVED',
    entityType: 'VERIFICATION_CASE',
    entityId: verificationCase.id,
    previousState: verificationCase.overall_status,
    newState: 'APPROVED',
    details: { remarks, applicationId: verificationCase.application_id }
  });

  createNotification({
    userId: verificationCase.bidder_id,
    role: 'BIDDER',
    type: 'VERIFICATION',
    title: 'Bid Verification Approved',
    message: 'Your bid application has been successfully verified and qualified by the CPCL Procurement Committee.',
    relatedEntity: 'BID_APPLICATION',
    relatedId: verificationCase.application_id
  });

  return res.json({ message: 'Verification case approved and bidder marked as QUALIFIED', status: 'APPROVED' });
});

// POST /api/verification/cases/:id/reject
router.post('/cases/:id/reject', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { reason, remarks } = req.body;
  if (!reason) {
    return res.status(400).json({ error: 'Rejection reason is mandatory for formal record' });
  }

  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ?', [req.params.id]);
  if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  db.transaction(() => {
    db.execute(
      `UPDATE verification_cases 
       SET overall_status = 'REJECTED', rejection_reason = ?, officer_remarks = ?, assigned_officer_id = ?, reviewed_at = ?, updated_at = ?
       WHERE id = ?`,
      [reason, remarks || '', req.user.id, now, now, verificationCase.id]
    );

    db.execute(
      "UPDATE bid_applications SET status = 'REJECTED' WHERE id = ?",
      [verificationCase.application_id]
    );
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'VERIFICATION_REJECTED',
    entityType: 'VERIFICATION_CASE',
    entityId: verificationCase.id,
    previousState: verificationCase.overall_status,
    newState: 'REJECTED',
    details: { reason, remarks }
  });

  createNotification({
    userId: verificationCase.bidder_id,
    role: 'BIDDER',
    type: 'VERIFICATION',
    title: 'Bid Verification Determination: Non-Compliant',
    message: `Your bid application was determined non-compliant. Reason: ${reason}`,
    relatedEntity: 'BID_APPLICATION',
    relatedId: verificationCase.application_id
  });

  return res.json({ message: 'Verification case rejected with formal audit log recorded', status: 'REJECTED' });
});

// POST /api/verification/cases/:id/escalate
router.post('/cases/:id/escalate', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { remarks } = req.body;
  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ?', [req.params.id]);
  if (!verificationCase) return res.status(404).json({ error: 'Verification case not found' });

  db.execute(
    "UPDATE verification_cases SET overall_status = 'ESCALATED', officer_remarks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [remarks || 'Escalated to Chief Vigilance Officer for scrutiny', verificationCase.id]
  );

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'CASE_ESCALATED_CVO',
    entityType: 'VERIFICATION_CASE',
    entityId: verificationCase.id,
    previousState: verificationCase.overall_status,
    newState: 'ESCALATED',
    details: { remarks }
  });

  notifyRole({
    role: 'ADMIN',
    type: 'RISK_ALERT',
    title: 'High-Risk Procurement Case Escalated to CVO',
    message: `Case ${verificationCase.id} has been escalated for scrutiny. Remarks: ${remarks || 'Critical anomaly detected.'}`,
    relatedEntity: 'VERIFICATION_CASE',
    relatedId: verificationCase.id
  });

  return res.json({ message: 'Case escalated to Chief Vigilance Officer', status: 'ESCALATED' });
});

// PUT /api/verification/cases/:id/update-field
router.put('/cases/:id/update-field', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { checkId, newResult, evidence } = req.body;
  if (!checkId || !newResult) {
    return res.status(400).json({ error: 'Check ID and new result are required' });
  }

  const check = db.queryOne('SELECT * FROM compliance_checks WHERE id = ?', [checkId]);
  if (!check) return res.status(404).json({ error: 'Compliance check rule not found' });

  db.execute(
    `UPDATE compliance_checks 
     SET result = ?, evidence = ?, review_status = 'MANUAL_OFFICER_OVERRIDE'
     WHERE id = ?`,
    [newResult, evidence || check.evidence, checkId]
  );

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'OFFICER_OVERRIDE_COMPLIANCE_RULE',
    entityType: 'COMPLIANCE_CHECK',
    entityId: checkId,
    previousState: check.result,
    newState: newResult,
    details: { requirement: check.requirement_name, evidence }
  });

  return res.json({ message: 'Compliance check updated with manual officer override', checkId, newResult });
});

export default router;
