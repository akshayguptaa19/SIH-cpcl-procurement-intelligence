import { Router } from 'express';
import db from '../db/database.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';

const router = Router();

// Only ADMIN or authorized high-level OFFICER can access admin routes
router.use(verifyToken, requireRole(['ADMIN', 'OFFICER']));

// GET /api/admin/officers/pending
router.get('/officers/pending', (req, res) => {
  const pendingOfficers = db.query(`
    SELECT u.id, u.email, COALESCE(u.full_name, u.name) AS full_name, u.phone, u.created_at,
           op.department, op.designation, op.employee_id, op.approval_status
    FROM users u
    JOIN officer_profiles op ON op.user_id = u.id
    WHERE op.approval_status IN ('PENDING', 'PENDING_APPROVAL')
    ORDER BY u.created_at DESC
  `);
  return res.json(pendingOfficers);
});

// POST /api/admin/officers/:id/approve
router.post('/officers/:id/approve', (req, res) => {
  const userId = req.params.id;
  const user = db.queryOne('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  db.transaction(() => {
    db.execute("UPDATE users SET status = 'ACTIVE', is_active = 1 WHERE id = ?", [userId]);
    db.execute("UPDATE officer_profiles SET approval_status = 'APPROVED' WHERE user_id = ?", [userId]);
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name || req.user.name,
    userRole: req.user.role,
    action: 'OFFICER_ACCOUNT_APPROVED',
    entityType: 'USER',
    entityId: userId,
    details: { approvedOfficer: user.full_name || user.name, approvedEmail: user.email }
  });

  createNotification({
    userId,
    role: 'OFFICER',
    type: 'SYSTEM',
    title: 'CPCL Officer Account Approved',
    message: 'Your official credentials have been verified by the Chief Vigilance Directorate. Full verification console access granted.'
  });

  return res.json({ message: 'Officer approved and activated successfully', userId });
});

// POST /api/admin/officers/:id/reject
router.post('/officers/:id/reject', (req, res) => {
  const userId = req.params.id;
  const { reason } = req.body;

  db.transaction(() => {
    db.execute("UPDATE users SET status = 'REJECTED', is_active = 0 WHERE id = ?", [userId]);
    db.execute("UPDATE officer_profiles SET approval_status = 'REJECTED' WHERE user_id = ?", [userId]);
  });

  logAuditAction({
    userId: req.user.id,
    userName: req.user.full_name,
    userRole: req.user.role,
    action: 'OFFICER_ACCOUNT_REJECTED',
    entityType: 'USER',
    entityId: userId,
    details: { reason }
  });

  return res.json({ message: 'Officer registration rejected', userId });
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  const users = db.query(`
    SELECT id, email, full_name, role, is_active, created_at, last_login_at
    FROM users
    ORDER BY created_at DESC
  `);
  return res.json(users);
});

export default router;
