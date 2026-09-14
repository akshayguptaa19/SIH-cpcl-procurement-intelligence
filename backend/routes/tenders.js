import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';

const router = Router();

// GET /api/tenders (Public or Authenticated)
router.get('/', (req, res) => {
  const { status, search, department, category, limit = 50, offset = 0 } = req.query;

  let query = `
    SELECT t.*,
      COALESCE(t.reference_number, t.tender_number) AS reference_number,
      COALESCE(t.tender_number, t.reference_number) AS tender_number,
      COALESCE(t.estimated_value, t.budget_amount, 0) AS estimated_value,
      COALESCE(t.budget_amount, t.estimated_value, 0) AS budget_amount,
      (SELECT COUNT(*) FROM bid_applications ba WHERE ba.tender_id = t.id) AS total_bids,
      (SELECT COUNT(*) FROM bid_applications ba WHERE ba.tender_id = t.id AND ba.status IN ('QUALIFIED', 'COMPLIANT', 'APPROVED')) AS verified_bids,
      (SELECT COUNT(*) FROM verification_cases vc WHERE vc.tender_id = t.id AND vc.risk_level IN ('HIGH', 'CRITICAL')) AS flagged_bids
    FROM tenders t
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    if (status === 'ACTIVE' || status === 'OPEN') {
      query += " AND t.status IN ('ACTIVE', 'OPEN', 'PUBLISHED')";
    } else {
      query += ' AND t.status = ?';
      params.push(status);
    }
  }
  if (department) {
    query += ' AND t.department = ?';
    params.push(department);
  }
  if (category) {
    query += ' AND t.category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (t.title LIKE ? OR t.reference_number LIKE ? OR t.tender_number LIKE ? OR t.description LIKE ? OR t.category LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const tenders = db.query(query, params);
  return res.json(tenders);
});

// GET /api/tenders/:id
router.get('/:id', (req, res) => {
  const tender = db.queryOne(
    `SELECT t.*,
      COALESCE(t.reference_number, t.tender_number) AS reference_number,
      COALESCE(t.tender_number, t.reference_number) AS tender_number,
      COALESCE(t.estimated_value, t.budget_amount, 0) AS estimated_value,
      COALESCE(t.budget_amount, t.estimated_value, 0) AS budget_amount,
      (SELECT COUNT(*) FROM bid_applications ba WHERE ba.tender_id = t.id) AS total_bids,
      (SELECT COUNT(*) FROM bid_applications ba WHERE ba.tender_id = t.id AND ba.status IN ('QUALIFIED', 'COMPLIANT', 'APPROVED')) AS verified_bids
     FROM tenders t WHERE t.id = ? OR t.reference_number = ? OR t.tender_number = ?`,
    [req.params.id, req.params.id, req.params.id]
  );

  if (!tender) {
    return res.status(404).json({ error: 'Tender not found' });
  }

  const requirements = db.query(
    'SELECT * FROM tender_requirements WHERE tender_id = ? ORDER BY is_mandatory DESC, id ASC',
    [tender.id]
  );

  const documentRequirements = db.query(
    'SELECT * FROM tender_document_requirements WHERE tender_id = ? ORDER BY is_mandatory DESC, id ASC',
    [tender.id]
  );

  return res.json({
    ...tender,
    requirements,
    documentRequirements
  });
});

// POST /api/tenders (Officer/Admin only)
router.post('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const {
    title,
    referenceNumber,
    description,
    department,
    category,
    estimatedValue,
    emdAmount,
    submissionDeadline,
    openingDate,
    requirements = [],
    documentRequirements = []
  } = req.body;

  if (!title || !referenceNumber || !estimatedValue || !submissionDeadline) {
    return res.status(400).json({ error: 'Title, reference number, estimated value, and deadline are required' });
  }

  const existing = db.queryOne('SELECT id FROM tenders WHERE reference_number = ?', [referenceNumber]);
  if (existing) {
    return res.status(409).json({ error: 'A tender with this reference number already exists' });
  }

  const tenderId = `TND-${Date.now()}`;

  db.transaction(() => {
    db.execute(
      `INSERT INTO tenders (id, tender_number, reference_number, title, description, department, category, status, budget_amount, estimated_value, emd_amount, publication_date, submission_start, submission_deadline, technical_opening_date, opening_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?, ?)`,
      [
        tenderId,
        referenceNumber,
        referenceNumber,
        title,
        description || '',
        department || 'Refinery Procurement Division',
        category || 'EQUIPMENT',
        Number(estimatedValue) || 10000000,
        Number(estimatedValue) || 10000000,
        Number(emdAmount) || 0,
        submissionDeadline,
        openingDate || submissionDeadline,
        openingDate || submissionDeadline,
        req.user.id
      ]
    );

    // Default Statutory & Financial Requirements if none passed
    const finalRequirements = requirements.length > 0 ? requirements : [
      { key: 'MIN_ANNUAL_TURNOVER', name: 'Minimum Annual Turnover', cat: 'FINANCIAL', op: 'GREATER_THAN_EQUAL', val: '50000000', unit: 'INR', mand: 1 },
      { key: 'MIN_YEARS_EXPERIENCE', name: 'Minimum Proven Track Record', cat: 'TECHNICAL', op: 'GREATER_THAN_EQUAL', val: '5', unit: 'YEARS', mand: 1 },
      { key: 'GST_ACTIVE_STATUS', name: 'GSTIN Sovereign Active Status', cat: 'STATUTORY', op: 'EQUALS', val: 'ACTIVE', unit: 'STATUS', mand: 1 },
      { key: 'PAN_LINKAGE_VERIFIED', name: 'PAN Sovereign Linkage', cat: 'STATUTORY', op: 'EQUALS', val: 'VALID', unit: 'STATUS', mand: 1 },
      { key: 'ISO_9001_CERTIFIED', name: 'ISO 9001 Quality Certification', cat: 'POLICY', op: 'EQUALS', val: 'VALID', unit: 'CERTIFICATE', mand: 0 }
    ];

    for (const reqItem of finalRequirements) {
      db.execute(
        `INSERT INTO tender_requirements (id, tender_id, name, requirement_name, requirement_key, rule_category, requirement_type, operator, expected_value, required_value, validation_rule, unit, is_mandatory)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `TREQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          tenderId,
          reqItem.name || reqItem.requirement_name || reqItem.key,
          reqItem.name || reqItem.requirement_name || reqItem.key,
          reqItem.key || reqItem.requirement_key || 'REQ',
          reqItem.cat || reqItem.rule_category || 'STATUTORY',
          reqItem.cat || reqItem.rule_category || 'STATUTORY',
          reqItem.op || reqItem.operator || 'EQUALS',
          reqItem.val || reqItem.expected_value || reqItem.required_value || 'VALID',
          reqItem.val || reqItem.expected_value || reqItem.required_value || 'VALID',
          `${reqItem.key || 'field'} ${reqItem.op || '=='} ${reqItem.val || 'value'}`,
          reqItem.unit || '',
          reqItem.mand !== undefined ? reqItem.mand : 1
        ]
      );
    }

    // Default Document Requirements
    const finalDocs = documentRequirements.length > 0 ? documentRequirements : [
      { type: 'GST_CERTIFICATE', name: 'GST Registration Certificate (Form REG-06)', mand: 1 },
      { type: 'PAN_CARD', name: 'Permanent Account Number (PAN Card)', mand: 1 },
      { type: 'AUDITED_BALANCE_SHEET', name: 'Audited Financial Statements (Last 3 FY)', mand: 1 },
      { type: 'OEM_AUTHORIZATION', name: 'OEM Authorization Letter', mand: 1 },
      { type: 'EXPERIENCE_CERTIFICATE', name: 'Past Performance & Completion Certificates', mand: 1 }
    ];

    for (const doc of finalDocs) {
      db.execute(
        `INSERT INTO tender_document_requirements (id, tender_id, document_type, document_name, is_mandatory, max_file_size_mb, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          `TDREQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          tenderId,
          doc.type || doc.document_type,
          doc.name || doc.document_name || doc.type,
          doc.mand !== undefined ? doc.mand : 1,
          doc.max_file_size_mb || 15,
          doc.description || doc.name || doc.type
        ]
      );
    }
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'TENDER_CREATED',
    entityType: 'TENDER',
    entityId: tenderId,
    details: { referenceNumber, title, estimatedValue }
  });

  const createdTender = db.queryOne('SELECT * FROM tenders WHERE id = ?', [tenderId]);
  return res.status(201).json(createdTender);
});

// POST /api/tenders/:id/publish
router.post('/:id/publish', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const tender = db.queryOne('SELECT * FROM tenders WHERE id = ?', [req.params.id]);
  if (!tender) return res.status(404).json({ error: 'Tender not found' });

  db.execute("UPDATE tenders SET status = 'ACTIVE' WHERE id = ?", [tender.id]);

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'TENDER_PUBLISHED',
    entityType: 'TENDER',
    entityId: tender.id,
    previousState: tender.status,
    newState: 'ACTIVE'
  });

  return res.json({ message: 'Tender published to sovereign GeM compliance network', id: tender.id });
});

export default router;
