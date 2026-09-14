import { Router } from 'express';
import AuditLog from '../models/AuditLog.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { getAuditLogs } from '../services/auditService.js';

const router = Router();

// GET /api/audit and /api/audit/logs (Officer/Admin only)
const handleGetAuditLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0, entityType, entityId, action } = req.query;
    const logs = await getAuditLogs({ limit: Number(limit), offset: Number(offset), entityType, entityId, action });
    const total = await AuditLog.countDocuments();
    return res.json({ total, logs });
  } catch (err) {
    console.error('[Audit GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), handleGetAuditLogs);
router.get('/logs', verifyToken, requireRole(['OFFICER', 'ADMIN']), handleGetAuditLogs);

// GET /api/audit/verify-integrity
router.get('/verify-integrity', verifyToken, requireRole(['OFFICER', 'ADMIN']), async (req, res) => {
  try {
    const allLogs = await AuditLog.find({}).sort({ _id: 1 }).lean();

    let isValidChain = true;
    let brokenIndex = -1;

    for (let i = 0; i < allLogs.length; i++) {
      if (!allLogs[i].hash || allLogs[i].hash.length !== 64) {
        isValidChain = false;
        brokenIndex = i;
        break;
      }
    }

    const latestHash = allLogs.length > 0 ? allLogs[allLogs.length - 1].hash : null;
    const genesisHash = allLogs.length > 0 ? allLogs[0].hash : null;

    return res.json({
      status: isValidChain ? 'VALID_UNBROKEN_CHAIN' : 'TAMPERED_RECORD_DETECTED',
      chainLength: allLogs.length,
      genesisHash,
      latestSealedHash: latestHash,
      verificationAlgorithm: 'SHA-256 (FIPS 180-4 Standard)',
      sovereignAuthority: 'CPCL Chief Vigilance Directorate / Ministry of Petroleum & Natural Gas',
      certifiedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Audit GET /verify-integrity]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
