import { Router } from 'express';
import User from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';

const router = Router();

// Only ADMIN or authorized high-level OFFICER can access admin routes
router.use(verifyToken, requireRole(['ADMIN', 'OFFICER']));

// GET /api/admin/officers/pending
router.get('/officers/pending', async (req, res) => {
  try {
    const pendingOfficers = await User.find({
      role: { $in: ['PROCUREMENT_OFFICER', 'SENIOR_OFFICER', 'COMPLIANCE_REVIEWER', 'OFFICER'] },
      'officer_profile.approval_status': { $in: ['PENDING', 'PENDING_APPROVAL'] }
    }, { password_hash: 0 }).sort({ created_at: -1 }).lean();

    return res.json(pendingOfficers.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name || u.name,
      phone: u.phone,
      created_at: u.created_at,
      department: u.officer_profile?.department,
      designation: u.officer_profile?.designation,
      employee_id: u.officer_profile?.employee_id,
      approval_status: u.officer_profile?.approval_status
    })));
  } catch (err) {
    console.error('[Admin GET /officers/pending]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/officers/:id/approve
router.post('/officers/:id/approve', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = 'ACTIVE';
    user.is_active = 1;
    if (user.officer_profile) user.officer_profile.approval_status = 'APPROVED';
    await user.save();

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'OFFICER_ACCOUNT_APPROVED', entityType: 'USER', entityId: userId,
      details: { approvedOfficer: user.full_name || user.name, approvedEmail: user.email }
    });

    await createNotification({
      userId, role: 'OFFICER', type: 'SYSTEM',
      title: 'CPCL Officer Account Approved',
      message: 'Your official credentials have been verified by the Chief Vigilance Directorate. Full verification console access granted.'
    });

    return res.json({ message: 'Officer approved and activated successfully', userId });
  } catch (err) {
    console.error('[Admin POST /officers/:id/approve]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/officers/:id/reject
router.post('/officers/:id/reject', async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;

    await User.updateOne({ id: userId }, { $set: { status: 'REJECTED', is_active: 0, 'officer_profile.approval_status': 'REJECTED' } });

    await logAuditAction({
      userId: req.user.id, userName: req.user.full_name || req.user.name, userRole: req.user.role,
      action: 'OFFICER_ACCOUNT_REJECTED', entityType: 'USER', entityId: userId,
      details: { reason }
    });

    return res.json({ message: 'Officer registration rejected', userId });
  } catch (err) {
    console.error('[Admin POST /officers/:id/reject]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password_hash: 0 }).sort({ created_at: -1 }).lean();
    return res.json(users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name || u.name,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      last_login_at: u.last_login_at
    })));
  } catch (err) {
    console.error('[Admin GET /users]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
