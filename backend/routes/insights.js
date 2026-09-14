import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/insights
router.get('/', verifyToken, (req, res) => {
  const { entityType, entityId, severity } = req.query;

  let query = "SELECT * FROM ai_insights WHERE status = 'ACTIVE'";
  const params = [];

  if (entityType) {
    query += ' AND entity_type = ?';
    params.push(entityType);
  }
  if (entityId) {
    query += ' AND entity_id = ?';
    params.push(entityId);
  }
  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }

  query += ' ORDER BY created_at DESC';

  const insights = db.query(query, params);
  return res.json(insights);
});

// POST /api/insights/:id/dismiss
router.post('/:id/dismiss', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  db.execute("UPDATE ai_insights SET status = 'DISMISSED' WHERE id = ?", [req.params.id]);
  return res.json({ message: 'Insight dismissed', id: req.params.id });
});

export default router;
