import { Router } from 'express';
import Clarification from '../models/Clarification.js';
import VerificationCase from '../models/VerificationCase.js';
import Tender from '../models/Tender.js';
import BidApplication from '../models/BidApplication.js';
import Company from '../models/Company.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification, notifyRole } from '../services/notificationService.js';

const router = Router();

// GET /api/clarifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, tenderId, caseId } = req.query;
    const filter = {};
    if (req.user.role === 'BIDDER') filter.bidder_id = req.user.id;
    if (status) filter.status = status;
    if (tenderId) filter.tender_id = tenderId;
    if (caseId) filter.case_id = caseId;

    const list = await Clarification.find(filter).sort({ created_at: -1 }).lean();

    const enriched = await Promise.all(list.map(async (cl) => {
      const [tender, app] = await Promise.all([
        Tender.findOne({ id: cl.tender_id }, { reference_number: 1, title: 1 }).lean(),
        BidApplication.findOne({ id: cl.application_id }, { application_number: 1, company_id: 1 }).lean()
      ]);
      const company = app?.company_id ? await Company.findOne({ id: app.company_id }, { name: 1 }).lean() : null;
      return {
        ...cl,
        tender_reference: tender?.reference_number,
        tender_title: tender?.title,
        company_name: company?.name,
        application_number: app?.application_number
      };
    }));

    return res.json(enriched);
  } catch (err) {
    console.error('[Clarifications GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clarifications (Officer raises query to bidder)
router.post('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const { caseId, applicationId, question } = req.body;
    if (!question || (!caseId && !applicationId)) {
      return res.status(400).json({ error: 'Question text and case or application ID are required' });
    }

    let verificationCase;
    if (caseId) {
      verificationCase = await VerificationCase.findOne({ id: caseId }).lean();
    } else {
      verificationCase = await VerificationCase.findOne({ application_id: applicationId }).lean();
    }
    if (!verificationCase) return res.status(404).json({ error: 'Associated verification case not found' });

    const clarificationId = `CLR-${Date.now()}`;

    await Clarification.create({
      id: clarificationId,
      case_id: verificationCase.id,
      application_id: verificationCase.application_id,
      tender_id: verificationCase.tender_id,
      bidder_id: verificationCase.bidder_id,
      question,
      from_user: req.user.full_name || req.user.name,
      status: 'AWAITING_RESPONSE'
    });

    await VerificationCase.updateOne({ id: verificationCase.id }, { $set: { overall_status: 'CLARIFICATION_REQUIRED' } });

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'CLARIFICATION_RAISED', entityType: 'CLARIFICATION', entityId: clarificationId,
      details: { question, bidderId: verificationCase.bidder_id, caseId: verificationCase.id }
    });

    await createNotification({
      userId: verificationCase.bidder_id, role: 'BIDDER', type: 'CLARIFICATION',
      title: 'Formal Clarification Requested by Verification Officer',
      message: question, relatedEntity: 'CLARIFICATION', relatedId: clarificationId
    });

    return res.status(201).json({ message: 'Formal clarification query dispatched to enterprise bidder', id: clarificationId, clarificationId, status: 'AWAITING_RESPONSE' });
  } catch (err) {
    console.error('[Clarifications POST /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clarifications/:id/respond (Bidder responds)
router.post('/:id/respond', verifyToken, async (req, res) => {
  try {
    const { response, attachmentUrl, attachmentName } = req.body;
    if (!response) return res.status(400).json({ error: 'Response text is mandatory' });

    const clarification = await Clarification.findOne({ id: req.params.id });
    if (!clarification) return res.status(404).json({ error: 'Clarification query not found' });

    if (req.user.role === 'BIDDER' && clarification.bidder_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    clarification.status = 'RESPONDED';
    clarification.response = response;
    clarification.response_date = new Date();
    clarification.attachment_url = attachmentUrl || null;
    clarification.attachment_name = attachmentName || null;
    await clarification.save();

    await VerificationCase.updateOne({ id: clarification.case_id }, { $set: { overall_status: 'IN_REVIEW' } });

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'CLARIFICATION_RESPONDED', entityType: 'CLARIFICATION', entityId: clarification.id,
      details: { response, attachmentName }
    });

    await notifyRole({
      role: 'OFFICER', type: 'CLARIFICATION', title: 'Enterprise Submitted Clarification Response',
      message: `Response received for query on Case ${clarification.case_id}. Ready for officer review.`,
      relatedEntity: 'CLARIFICATION', relatedId: clarification.id
    });

    return res.json({ message: 'Response recorded and forwarded to Verification Officer', status: 'RESPONDED' });
  } catch (err) {
    console.error('[Clarifications POST /:id/respond]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clarifications/:id/resolve (Officer marks resolved)
router.post('/:id/resolve', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const clarification = await Clarification.findOne({ id: req.params.id });
    if (!clarification) return res.status(404).json({ error: 'Clarification query not found' });

    clarification.status = 'RESOLVED';
    await clarification.save();

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'CLARIFICATION_RESOLVED', entityType: 'CLARIFICATION', entityId: clarification.id
    });

    return res.json({ message: 'Clarification marked as resolved', status: 'RESOLVED' });
  } catch (err) {
    console.error('[Clarifications POST /:id/resolve]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
