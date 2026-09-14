import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification, notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/clarifications
router.get('/', verifyToken, (req, res) => {
  const { status, tenderId, caseId } = req.query;

  let query = `
    SELECT 
      cl.*,
      t.reference_number AS tender_reference,
      t.title AS tender_title,
      c.name AS company_name,
      ba.application_number
    FROM clarifications cl
    JOIN tenders t ON t.id = cl.tender_id
    JOIN bid_applications ba ON ba.id = cl.application_id
    JOIN companies c ON c.id = ba.company_id
    WHERE 1=1
  `;
  const params = [];

  // Bidder Isolation
  if (req.user.role === 'BIDDER') {
    query += ' AND cl.bidder_id = ?';
    params.push(req.user.id);
  }

  if (status) {
    query += ' AND cl.status = ?';
    params.push(status);
  }
  if (tenderId) {
    query += ' AND cl.tender_id = ?';
    params.push(tenderId);
  }
  if (caseId) {
    query += ' AND cl.case_id = ?';
    params.push(caseId);
  }

  query += ' ORDER BY cl.created_at DESC';

  const list = db.query(query, params);
  return res.json(list);
});

// POST /api/clarifications (Officer raises query to bidder)
router.post('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const { caseId, applicationId, question } = req.body;
  if (!question || (!caseId && !applicationId)) {
    return res.status(400).json({ error: 'Question text and case or application ID are required' });
  }

  let verificationCase;
  if (caseId) {
    verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ?', [caseId]);
  } else {
    verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE application_id = ?', [applicationId]);
  }

  if (!verificationCase) {
    return res.status(404).json({ error: 'Associated verification case not found' });
  }

  const clarificationId = `CLR-${Date.now()}`;

  db.transaction(() => {
    db.execute(
      `INSERT INTO clarifications (id, case_id, application_id, tender_id, bidder_id, question, from_user, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'AWAITING_RESPONSE')`,
      [clarificationId, verificationCase.id, verificationCase.application_id, verificationCase.tender_id, verificationCase.bidder_id, question, req.user.full_name]
    );

    db.execute(
      "UPDATE verification_cases SET overall_status = 'CLARIFICATION_REQUIRED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [verificationCase.id]
    );
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'CLARIFICATION_RAISED',
    entityType: 'CLARIFICATION',
    entityId: clarificationId,
    details: { question, bidderId: verificationCase.bidder_id, caseId: verificationCase.id }
  });

  createNotification({
    userId: verificationCase.bidder_id,
    role: 'BIDDER',
    type: 'CLARIFICATION',
    title: 'Formal Clarification Requested by Verification Officer',
    message: question,
    relatedEntity: 'CLARIFICATION',
    relatedId: clarificationId
  });

  return res.status(201).json({
    message: 'Formal clarification query dispatched to enterprise bidder',
    id: clarificationId,
    clarificationId,
    status: 'AWAITING_RESPONSE'
  });
});

// POST /api/clarifications/:id/respond (Bidder responds)
router.post('/:id/respond', verifyToken, (req, res) => {
  const { response, attachmentUrl, attachmentName } = req.body;
  if (!response) {
    return res.status(400).json({ error: 'Response text is mandatory' });
  }

  const query = db.queryOne('SELECT * FROM clarifications WHERE id = ?', [req.params.id]);
  if (!query) return res.status(404).json({ error: 'Clarification query not found' });

  if (req.user.role === 'BIDDER' && query.bidder_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  db.transaction(() => {
    db.execute(
      `UPDATE clarifications 
       SET status = 'RESPONDED', response = ?, response_date = ?, attachment_url = ?, attachment_name = ?
       WHERE id = ?`,
      [response, now, attachmentUrl || null, attachmentName || null, query.id]
    );

    db.execute(
      "UPDATE verification_cases SET overall_status = 'IN_REVIEW', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [query.case_id]
    );
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'CLARIFICATION_RESPONDED',
    entityType: 'CLARIFICATION',
    entityId: query.id,
    details: { response, attachmentName }
  });

  notifyRole({
    role: 'OFFICER',
    type: 'CLARIFICATION',
    title: 'Enterprise Submitted Clarification Response',
    message: `Response received for query on Case ${query.case_id}. Ready for officer review.`,
    relatedEntity: 'CLARIFICATION',
    relatedId: query.id
  });

  return res.json({ message: 'Response recorded and forwarded to Verification Officer', status: 'RESPONDED' });
});

// POST /api/clarifications/:id/resolve (Officer marks resolved)
router.post('/:id/resolve', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const query = db.queryOne('SELECT * FROM clarifications WHERE id = ?', [req.params.id]);
  if (!query) return res.status(404).json({ error: 'Clarification query not found' });

  db.execute("UPDATE clarifications SET status = 'RESOLVED' WHERE id = ?", [query.id]);

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'CLARIFICATION_RESOLVED',
    entityType: 'CLARIFICATION',
    entityId: query.id
  });

  return res.json({ message: 'Clarification marked as resolved', status: 'RESOLVED' });
});

export default router;
