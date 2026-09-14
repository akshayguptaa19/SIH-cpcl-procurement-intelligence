import { Router } from 'express';
import VerificationCase from '../models/VerificationCase.js';
import Company from '../models/Company.js';
import Tender from '../models/Tender.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { calculateRisk } from '../services/riskEngine.js';

const router = Router();

// GET /api/risk/overview, /summary, / (Officer/Admin only)
router.get(['/overview', '/summary', '/'], verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const cases = await VerificationCase.find({}).lean();

    const companyIds = [...new Set(cases.map(c => c.company_id).filter(Boolean))];
    const tenderIds = [...new Set(cases.map(c => c.tender_id).filter(Boolean))];

    const [companies, tenders] = await Promise.all([
      Company.find({ id: { $in: companyIds } }).lean(),
      Tender.find({ id: { $in: tenderIds } }).lean()
    ]);

    const compMap = new Map(companies.map(c => [c.id, c.name || c.legal_name]));
    const tenderMap = new Map(tenders.map(t => [t.id, t.reference_number || t.tender_number]));

    const enrichedCases = cases.map(c => ({
      ...c,
      company_name: compMap.get(c.company_id) || 'Unknown Enterprise',
      tender_reference: tenderMap.get(c.tender_id) || 'General Tender'
    }));

    const lowRisk = cases.filter(c => (c.risk_level || '').toUpperCase() === 'LOW').length;
    const mediumRisk = cases.filter(c => (c.risk_level || '').toUpperCase() === 'MEDIUM').length;
    const highRisk = cases.filter(c => (c.risk_level || '').toUpperCase() === 'HIGH').length;
    const criticalRisk = cases.filter(c => (c.risk_level || '').toUpperCase() === 'CRITICAL').length;

    const avgRiskScore = cases.length > 0
      ? Math.round(cases.reduce((sum, c) => sum + (c.risk_score || 0), 0) / cases.length)
      : 15;

    const flaggedCases = enrichedCases
      .filter(c => ['HIGH', 'CRITICAL'].includes((c.risk_level || '').toUpperCase()))
      .slice(0, 10);

    // Compute category averages from embedded risk_assessments
    const categoryStats = {};
    for (const c of cases) {
      if (Array.isArray(c.risk_assessments)) {
        for (const ra of c.risk_assessments) {
          const cat = ra.risk_category || 'GENERAL';
          if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };
          categoryStats[cat].total += (ra.risk_score || 0);
          categoryStats[cat].count += 1;
        }
      }
    }

    const categoryAverages = Object.entries(categoryStats).map(([cat, stat]) => ({
      risk_category: cat,
      avg_score: Math.round(stat.total / stat.count),
      count: stat.count
    }));

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
  } catch (err) {
    console.error('[GET /api/risk/overview]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/risk/cases/:id
router.get('/cases/:id', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const caseId = req.params.id;
    const verificationCase = await VerificationCase.findOne({
      $or: [{ id: caseId }, { application_id: caseId }]
    }).lean();

    if (!verificationCase) return res.status(404).json({ error: 'Case not found' });

    const assessments = (verificationCase.risk_assessments || []).map(a => ({
      ...a,
      risk_factors: Array.isArray(a.risk_factors) ? a.risk_factors : []
    }));

    return res.json({
      overallRiskScore: verificationCase.risk_score,
      riskLevel: verificationCase.risk_level,
      assessments
    });
  } catch (err) {
    console.error('[GET /api/risk/cases/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/risk/recalculate/:applicationId
router.post('/recalculate/:applicationId', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const verificationCase = await VerificationCase.findOne({ application_id: req.params.applicationId }).lean();
    if (!verificationCase) return res.status(404).json({ error: 'Case not found' });

    const result = await calculateRisk(req.params.applicationId, verificationCase.id);

    return res.json(result);
  } catch (err) {
    console.error('[POST /api/risk/recalculate]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
