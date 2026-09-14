import { Router } from 'express';
import db from '../db/database.js';
import { getIntegrationsStatus, testIntegrationEndpoint } from '../services/integrationsService.js';

const router = Router();

// GET /api/system/health (Public / Health check)
router.get('/health', (req, res) => {
  try {
    const check = db.queryOne('SELECT 1 as alive');
    const tableCounts = {
      users: db.queryOne('SELECT COUNT(*) as c FROM users')?.c || 0,
      tenders: db.queryOne('SELECT COUNT(*) as c FROM tenders')?.c || 0,
      applications: db.queryOne('SELECT COUNT(*) as c FROM bid_applications')?.c || 0,
      documents: db.queryOne('SELECT COUNT(*) as c FROM documents')?.c || 0,
      auditLogs: db.queryOne('SELECT COUNT(*) as c FROM audit_logs')?.c || 0
    };

    return res.json({
      status: 'HEALTHY',
      service: 'CPCL Sovereign AI Bid Compliance Backend',
      environment: process.env.NODE_ENV || 'production',
      nodeVersion: process.version,
      platform: process.platform,
      database: {
        engine: 'SQLite (node:sqlite native WAL mode)',
        status: check?.alive === 1 ? 'CONNECTED' : 'DISCONNECTED',
        tableCounts
      },
      memory: process.memoryUsage(),
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ status: 'UNHEALTHY', error: error.message });
  }
});

// GET /api/system/integrations
router.get('/integrations', (req, res) => {
  const integrations = getIntegrationsStatus();
  return res.json(integrations);
});

// POST /api/system/integrations/:id/test
router.post('/integrations/:id/test', (req, res) => {
  const result = testIntegrationEndpoint(req.params.id);
  if (!result) return res.status(404).json({ error: 'Integration gateway not found' });
  return res.json({ message: 'Sovereign gateway latency test complete', integration: result });
});

export default router;
