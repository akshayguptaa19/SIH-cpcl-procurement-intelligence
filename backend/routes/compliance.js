import { Router } from 'express';
import VerificationCase from '../models/VerificationCase.js';
import BidApplication from '../models/BidApplication.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { evaluateCompliance } from '../services/complianceEngine.js';

const router = Router();

// GET /api/compliance, /api/compliance/rules, /api/compliance/checks
router.get(['/', '/rules', '/checks'], verifyToken, async (req, res) => {
  try {
    const { applicationId, caseId, category, result } = req.query;

    const query = {};
    if (caseId) query.id = caseId;
    if (applicationId) query.application_id = applicationId;

    const cases = await VerificationCase.find(query).lean();
    let allChecks = [];
    for (const c of cases) {
      if (Array.isArray(c.checks)) {
        allChecks.push(...c.checks.map(chk => ({ ...chk, case_id: c.id, application_id: c.application_id })));
      }
    }

    if (category) {
      allChecks = allChecks.filter(c => c.category === category);
    }
    if (result) {
      allChecks = allChecks.filter(c => c.result === result);
    }

    // Calculate summary metrics
    const total = allChecks.length;
    const passed = allChecks.filter(c => c.result === 'PASS').length;
    const failed = allChecks.filter(c => c.result === 'FAIL').length;
    const warnings = allChecks.filter(c => c.result === 'WARNING').length;

    return res.json({
      summary: {
        totalChecks: total,
        passedChecks: passed,
        failedChecks: failed,
        warnings,
        passRate: total > 0 ? Math.round((passed / total) * 100) : 100
      },
      checks: allChecks
    });
  } catch (err) {
    console.error('[GET /api/compliance]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/compliance/evaluate/:applicationId
router.post('/evaluate/:applicationId', verifyToken, async (req, res) => {
  try {
    const application = await BidApplication.findOne({
      $or: [{ id: req.params.applicationId }, { application_number: req.params.applicationId }]
    }).lean();
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const verificationCase = await VerificationCase.findOne({ application_id: application.id }).lean();
    const caseId = verificationCase ? verificationCase.id : `CASE-${Date.now()}`;

    const result = await evaluateCompliance(application.id, caseId);
    return res.json(result);
  } catch (err) {
    console.error('[POST /api/compliance/evaluate]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
