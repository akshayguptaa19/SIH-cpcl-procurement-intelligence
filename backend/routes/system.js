import { Router } from 'express';
import User from '../models/User.js';
import Tender from '../models/Tender.js';
import BidApplication from '../models/BidApplication.js';
import Document from '../models/Document.js';
import AuditLog from '../models/AuditLog.js';
import { getIntegrationsStatus, testIntegrationEndpoint } from '../services/integrationsService.js';

const router = Router();

// GET /api/system/health (Public / Health check)
router.get('/health', async (req, res) => {
  try {
    const [users, tenders, applications, documents, auditLogs] = await Promise.all([
      User.countDocuments(),
      Tender.countDocuments(),
      BidApplication.countDocuments(),
      Document.countDocuments(),
      AuditLog.countDocuments()
    ]);

    return res.json({
      status: 'HEALTHY',
      service: 'CPCL Sovereign AI Bid Compliance Backend',
      environment: process.env.NODE_ENV || 'production',
      nodeVersion: process.version,
      platform: process.platform,
      database: {
        engine: 'MongoDB (Mongoose ODM)',
        status: 'CONNECTED',
        tableCounts: { users, tenders, applications, documents, auditLogs }
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
router.get('/integrations', async (req, res) => {
  try {
    const integrations = await getIntegrationsStatus();
    return res.json(integrations);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// POST /api/system/integrations/:id/test
router.post('/integrations/:id/test', async (req, res) => {
  try {
    const result = await testIntegrationEndpoint(req.params.id);
    if (!result) return res.status(404).json({ error: 'Integration gateway not found' });
    return res.json({ message: 'Sovereign gateway latency test complete', integration: result });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to test integration endpoint' });
  }
});

export default router;
