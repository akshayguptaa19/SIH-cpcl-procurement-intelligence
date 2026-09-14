import { Router } from 'express';
import AiInsight from '../models/AiInsight.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/insights, /patterns
router.get(['/', '/patterns'], verifyToken, async (req, res) => {
  try {
    const { entityType, entityId, severity } = req.query;

    const query = { status: 'ACTIVE' };
    if (entityType) query.entity_type = entityType;
    if (entityId) query.entity_id = entityId;
    if (severity) query.severity = severity;

    const insights = await AiInsight.find(query).sort({ created_at: -1 }).lean();
    return res.json(insights);
  } catch (err) {
    console.error('[GET /api/insights]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/insights/:id/dismiss
router.post('/:id/dismiss', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    await AiInsight.updateOne({ id: req.params.id }, { $set: { status: 'DISMISSED' } });
    return res.json({ message: 'Insight dismissed', id: req.params.id });
  } catch (err) {
    console.error('[POST /api/insights/:id/dismiss]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
