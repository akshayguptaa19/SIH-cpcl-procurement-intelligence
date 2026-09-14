import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { evaluateCompliance } from '../services/complianceEngine.js';

const router = Router();

// GET /api/compliance
router.get('/', verifyToken, (req, res) => {
  const { applicationId, caseId, category, result } = req.query;

  let query = 'SELECT * FROM compliance_checks WHERE 1=1';
  const params = [];

  if (applicationId) {
    query += ' AND application_id = ?';
    params.push(applicationId);
  }
  if (caseId) {
    query += ' AND case_id = ?';
    params.push(caseId);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (result) {
    query += ' AND result = ?';
    params.push(result);
  }

  query += ' ORDER BY created_at DESC';

  const checks = db.query(query, params);

  // Calculate summary metrics
  const total = checks.length;
  const passed = checks.filter(c => c.result === 'PASS').length;
  const failed = checks.filter(c => c.result === 'FAIL').length;
  const warnings = checks.filter(c => c.result === 'WARNING').length;

  return res.json({
    summary: {
      totalChecks: total,
      passedChecks: passed,
      failedChecks: failed,
      warnings,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 100
    },
    checks
  });
});

// POST /api/compliance/evaluate/:applicationId
router.post('/evaluate/:applicationId', verifyToken, (req, res) => {
  const application = db.queryOne('SELECT * FROM bid_applications WHERE id = ?', [req.params.applicationId]);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE application_id = ?', [application.id]);
  const caseId = verificationCase ? verificationCase.id : `CASE-${Date.now()}`;

  const result = evaluateCompliance(application.id, caseId);
  return res.json(result);
});

export default router;
