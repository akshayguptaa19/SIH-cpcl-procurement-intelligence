import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { calculateRisk } from '../services/riskEngine.js';

const router = Router();

// GET /api/risk/overview (Officer/Admin only)
router.get('/overview', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const cases = db.query(`
    SELECT vc.*, COALESCE(c.name, c.legal_name) AS company_name, COALESCE(t.reference_number, t.tender_number) AS tender_reference
    FROM verification_cases vc
    JOIN companies c ON c.id = vc.company_id
    JOIN tenders t ON t.id = vc.tender_id
  `);

  const lowRisk = cases.filter(c => c.risk_level === 'LOW').length;
  const mediumRisk = cases.filter(c => c.risk_level === 'MEDIUM').length;
  const highRisk = cases.filter(c => c.risk_level === 'HIGH').length;
  const criticalRisk = cases.filter(c => c.risk_level === 'CRITICAL').length;

  const avgRiskScore = cases.length > 0
    ? Math.round(cases.reduce((sum, c) => sum + (c.risk_score || 0), 0) / cases.length)
    : 15;

  const flaggedCases = cases
    .filter(c => c.risk_level === 'HIGH' || c.risk_level === 'CRITICAL')
    .slice(0, 10);

  const categoryAverages = db.query(`
    SELECT risk_category, AVG(risk_score) AS avg_score, COUNT(*) AS count
    FROM risk_assessments
    GROUP BY risk_category
  `);

  return res.json({
    summary: {
      totalEvaluated: cases.length,
      averageRiskScore: avgRiskScore,
      distribution: {
        low: lowRisk,
        medium: mediumRisk,
        high: highRisk,
        critical: criticalRisk
      }
    },
    categoryAverages,
    flaggedCases
  });
});

// GET /api/risk/cases/:id
router.get('/cases/:id', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const caseId = req.params.id;
  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE id = ? OR application_id = ?', [caseId, caseId]);
  if (!verificationCase) return res.status(404).json({ error: 'Case not found' });

  const assessments = db.query('SELECT * FROM risk_assessments WHERE case_id = ?', [verificationCase.id]).map(a => ({
    ...a,
    risk_factors: a.risk_factors_json ? JSON.parse(a.risk_factors_json) : []
  }));

  return res.json({
    overallRiskScore: verificationCase.risk_score,
    riskLevel: verificationCase.risk_level,
    assessments
  });
});

// POST /api/risk/recalculate/:applicationId
router.post('/recalculate/:applicationId', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const verificationCase = db.queryOne('SELECT * FROM verification_cases WHERE application_id = ?', [req.params.applicationId]);
  if (!verificationCase) return res.status(404).json({ error: 'Case not found' });

  const result = calculateRisk(req.params.applicationId, verificationCase.id);
  db.execute(
    'UPDATE verification_cases SET risk_score = ?, risk_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [result.overallRiskScore, result.riskLevel, verificationCase.id]
  );

  return res.json(result);
});

export default router;
