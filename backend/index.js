import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// DB & Models
import { connectDB } from './db/database.js';
import { seedDatabase } from './db/seedMongo.js';

// Routes
import authRouter from './routes/auth.js';
import tendersRouter from './routes/tenders.js';
import biddersRouter from './routes/bidders.js';
import applicationsRouter from './routes/applications.js';
import documentsRouter from './routes/documents.js';
import verificationRouter from './routes/verification.js';
import clarificationsRouter from './routes/clarifications.js';
import complianceRouter from './routes/compliance.js';
import riskRouter from './routes/risk.js';
import insightsRouter from './routes/insights.js';
import reportsRouter from './routes/reports.js';
import auditRouter from './routes/audit.js';
import notificationsRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';
import dashboardRouter from './routes/dashboard.js';
import systemRouter from './routes/system.js';
import aiRouter from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure storage directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const reportsDir = path.join(uploadsDir, 'reports');
const bidsDir = path.join(uploadsDir, 'bids');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
if (!fs.existsSync(bidsDir)) fs.mkdirSync(bidsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static Document Access
app.use('/uploads', express.static(uploadsDir));

// Route Mounts
app.use('/api/auth', authRouter);
app.use('/api/tenders', tendersRouter);
app.use('/api/bidders', biddersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/clarifications', clarificationsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/risk', riskRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/system', systemRouter);
app.use('/api/ai', aiRouter);

// Root Status
app.get('/api', (req, res) => {
  res.json({
    platform: 'CPCL AI Procurement Intelligence Platform (MoPNG Sovereign Network)',
    version: '3.0.0',
    status: 'ONLINE',
    database: 'MongoDB (Mongoose ODM)',
    documentation: '/api/system/health'
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found on CPCL API server` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server exception:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Sovereign API Server Error',
    referenceCode: `ERR-${Date.now()}`
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.error('[Database Startup Error]:', err.message);
    console.warn('[Server Startup Warning]: MongoDB connection failed or deferred. Server will continue running.');
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CPCL Sovereign API Server running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/system/health`);
    console.log(`🛡️  Database: MongoDB (Mongoose ODM)`);
    console.log(`📁 Uploads Directory: ${uploadsDir}`);
    console.log(`=======================================================`);
  });
}

startServer();

export default app;
