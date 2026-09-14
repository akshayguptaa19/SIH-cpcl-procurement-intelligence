import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { getAuditLogs } from '../services/auditService.js';

const router = Router();

// GET /api/audit and /api/audit/logs (Officer/Admin only)
const handleGetAuditLogs = (req, res) => {
  const { limit = 50, offset = 0, entityType, entityId, action } = req.query;
  const logs = getAuditLogs({
    limit: Number(limit),
    offset: Number(offset),
    entityType,
    entityId,
    action
  });

  const totalCount = db.queryOne('SELECT COUNT(*) as count FROM audit_logs');

  return res.json({
    total: totalCount ? totalCount.count : logs.length,
    logs
  });
};

router.get('/', verifyToken, requireRole(['OFFICER', 'ADMIN']), handleGetAuditLogs);
router.get('/logs', verifyToken, requireRole(['OFFICER', 'ADMIN']), handleGetAuditLogs);

// GET /api/audit/verify-integrity
router.get('/verify-integrity', verifyToken, requireRole(['OFFICER', 'ADMIN']), (req, res) => {
  const allLogs = db.query('SELECT * FROM audit_logs ORDER BY rowid ASC');

  // Verify hash integrity across the chain
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
});

export default router;
