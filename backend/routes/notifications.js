import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserNotifications, markAsRead, markAllAsRead, createNotification } from '../services/notificationService.js';

const router = Router();

// GET /api/notifications
router.get('/', verifyToken, (req, res) => {
  const notifications = getUserNotifications(req.user.id);
  return res.json(notifications);
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, (req, res) => {
  markAsRead(req.params.id, req.user.id);
  return res.json({ message: 'Marked as read', id: req.params.id });
});

// PUT /api/notifications/read-all
router.put('/read-all', verifyToken, (req, res) => {
  markAllAsRead(req.user.id);
  return res.json({ message: 'All notifications marked as read' });
});

// POST /api/notifications (Officer / Admin broadcast)
router.post('/', verifyToken, (req, res) => {
  const { title, message, type, recipientId } = req.body;
  const notif = createNotification({
    userId: recipientId || req.user.id,
    role: req.user.role,
    type: type || 'SYSTEM',
    title: title || 'Notice',
    message: message || ''
  });
  return res.status(201).json(notif);
});

export default router;
