import { Router } from 'express';
import Tender from '../models/Tender.js';
import BidApplication from '../models/BidApplication.js';
import VerificationCase from '../models/VerificationCase.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';

const router = Router();

// GET /api/tenders (Public or Authenticated)
router.get('/', async (req, res) => {
  try {
    const { status, search, department, category, limit = 50, offset = 0 } = req.query;

    const filter = {};
    if (status) {
      if (status === 'ACTIVE' || status === 'OPEN') {
        filter.status = { $in: ['ACTIVE', 'OPEN', 'PUBLISHED'] };
      } else {
        filter.status = status;
      }
    }
    if (department) filter.department = department;
    if (category) filter.category = category;
    if (search) {
      const term = new RegExp(search, 'i');
      filter.$or = [
        { title: term }, { reference_number: term },
        { tender_number: term }, { description: term }, { category: term }
      ];
    }

    const tenders = await Tender.find(filter)
      .sort({ created_at: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean();

    // Enrich with bid counts
    const enriched = await Promise.all(tenders.map(async (t) => {
      const total_bids = await BidApplication.countDocuments({ tender_id: t.id });
      const verified_bids = await BidApplication.countDocuments({ tender_id: t.id, status: { $in: ['QUALIFIED', 'COMPLIANT', 'APPROVED'] } });
      const flagged_bids = await VerificationCase.countDocuments({ tender_id: t.id, risk_level: { $in: ['HIGH', 'CRITICAL'] } });
      return {
        ...t,
        reference_number: t.reference_number || t.tender_number,
        tender_number: t.tender_number || t.reference_number,
        estimated_value: t.estimated_value || t.budget_amount || 0,
        budget_amount: t.budget_amount || t.estimated_value || 0,
        total_bids, verified_bids, flagged_bids
      };
    }));

    return res.json(enriched);
  } catch (err) {
    console.error('[Tenders GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tenders/:id
router.get('/:id', async (req, res) => {
  try {
    const tender = await Tender.findOne({
      $or: [{ id: req.params.id }, { reference_number: req.params.id }, { tender_number: req.params.id }]
    }).lean();

    if (!tender) return res.status(404).json({ error: 'Tender not found' });

    const total_bids = await BidApplication.countDocuments({ tender_id: tender.id });
    const verified_bids = await BidApplication.countDocuments({ tender_id: tender.id, status: { $in: ['QUALIFIED', 'COMPLIANT', 'APPROVED'] } });

    return res.json({
      ...tender,
      reference_number: tender.reference_number || tender.tender_number,
      tender_number: tender.tender_number || tender.reference_number,
      estimated_value: tender.estimated_value || tender.budget_amount || 0,
      budget_amount: tender.budget_amount || tender.estimated_value || 0,
      total_bids, verified_bids,
      requirements: tender.requirements || [],
      documentRequirements: tender.document_requirements || []
    });
  } catch (err) {
    console.error('[Tenders GET /:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tenders (Officer/Admin only)
router.post('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { title, referenceNumber, description, department, category, estimatedValue, emdAmount, submissionDeadline, openingDate, requirements = [], documentRequirements = [] } = req.body;

    if (!title || !referenceNumber || !estimatedValue || !submissionDeadline) {
      return res.status(400).json({ error: 'Title, reference number, estimated value, and deadline are required' });
    }

    const existing = await Tender.findOne({ reference_number: referenceNumber });
    if (existing) return res.status(409).json({ error: 'A tender with this reference number already exists' });

    const tenderId = `TND-${Date.now()}`;
    const now = new Date();

    const finalRequirements = requirements.length > 0 ? requirements : [
      { id: `TREQ-${Date.now()}-1`, name: 'Minimum Annual Turnover', requirement_name: 'Minimum Annual Turnover', requirement_key: 'MIN_ANNUAL_TURNOVER', rule_category: 'FINANCIAL', requirement_type: 'FINANCIAL', operator: 'GREATER_THAN_EQUAL', expected_value: '50000000', required_value: '50000000', unit: 'INR', is_mandatory: 1 },
      { id: `TREQ-${Date.now()}-2`, name: 'Minimum Proven Track Record', requirement_name: 'Minimum Proven Track Record', requirement_key: 'MIN_YEARS_EXPERIENCE', rule_category: 'TECHNICAL', requirement_type: 'TECHNICAL', operator: 'GREATER_THAN_EQUAL', expected_value: '5', required_value: '5', unit: 'YEARS', is_mandatory: 1 },
      { id: `TREQ-${Date.now()}-3`, name: 'GSTIN Sovereign Active Status', requirement_name: 'GSTIN Sovereign Active Status', requirement_key: 'GST_ACTIVE_STATUS', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'ACTIVE', required_value: 'ACTIVE', unit: 'STATUS', is_mandatory: 1 },
      { id: `TREQ-${Date.now()}-4`, name: 'PAN Sovereign Linkage', requirement_name: 'PAN Sovereign Linkage', requirement_key: 'PAN_LINKAGE_VERIFIED', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'VALID', required_value: 'VALID', unit: 'STATUS', is_mandatory: 1 },
      { id: `TREQ-${Date.now()}-5`, name: 'ISO 9001 Quality Certification', requirement_name: 'ISO 9001 Quality Certification', requirement_key: 'ISO_9001_CERTIFIED', rule_category: 'POLICY', requirement_type: 'POLICY', operator: 'EQUALS', expected_value: 'VALID', required_value: 'VALID', unit: 'CERTIFICATE', is_mandatory: 0 }
    ];

    const finalDocs = documentRequirements.length > 0 ? documentRequirements : [
      { id: `TDREQ-${Date.now()}-1`, document_type: 'GST_CERTIFICATE', document_name: 'GST Registration Certificate (Form REG-06)', is_mandatory: 1, max_file_size_mb: 15 },
      { id: `TDREQ-${Date.now()}-2`, document_type: 'PAN_CARD', document_name: 'Permanent Account Number (PAN Card)', is_mandatory: 1, max_file_size_mb: 5 },
      { id: `TDREQ-${Date.now()}-3`, document_type: 'AUDITED_BALANCE_SHEET', document_name: 'Audited Financial Statements (Last 3 FY)', is_mandatory: 1, max_file_size_mb: 20 },
      { id: `TDREQ-${Date.now()}-4`, document_type: 'OEM_AUTHORIZATION', document_name: 'OEM Authorization Letter', is_mandatory: 1, max_file_size_mb: 10 },
      { id: `TDREQ-${Date.now()}-5`, document_type: 'EXPERIENCE_CERTIFICATE', document_name: 'Past Performance & Completion Certificates', is_mandatory: 1, max_file_size_mb: 15 }
    ];

    const createdTender = await Tender.create({
      id: tenderId,
      tender_number: referenceNumber,
      reference_number: referenceNumber,
      title,
      description: description || '',
      department: department || 'Refinery Procurement Division',
      category: category || 'EQUIPMENT',
      status: 'ACTIVE',
      budget_amount: Number(estimatedValue) || 10000000,
      estimated_value: Number(estimatedValue) || 10000000,
      emd_amount: Number(emdAmount) || 0,
      publication_date: now,
      submission_start: now,
      submission_deadline: new Date(submissionDeadline),
      opening_date: openingDate ? new Date(openingDate) : new Date(submissionDeadline),
      created_by: req.user.id,
      requirements: finalRequirements,
      document_requirements: finalDocs
    });

    await logAuditAction({
      userId: req.user.id,
      userName: req.user.full_name || req.user.name,
      userRole: req.user.role,
      action: 'TENDER_CREATED',
      entityType: 'TENDER',
      entityId: tenderId,
      details: { referenceNumber, title, estimatedValue }
    });

    return res.status(201).json(createdTender.toObject());
  } catch (err) {
    console.error('[Tenders POST /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tenders/:id/publish
router.post('/:id/publish', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const tender = await Tender.findOne({ id: req.params.id });
    if (!tender) return res.status(404).json({ error: 'Tender not found' });

    const prevStatus = tender.status;
    tender.status = 'ACTIVE';
    await tender.save();

    await logAuditAction({
      userId: req.user.id,
      userName: req.user.full_name || req.user.name,
      userRole: req.user.role,
      action: 'TENDER_PUBLISHED',
      entityType: 'TENDER',
      entityId: tender.id,
      previousState: prevStatus,
      newState: 'ACTIVE'
    });

    return res.json({ message: 'Tender published to sovereign GeM compliance network', id: tender.id });
  } catch (err) {
    console.error('[Tenders POST /:id/publish]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
