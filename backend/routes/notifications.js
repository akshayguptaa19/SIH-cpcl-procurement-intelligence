import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserNotifications, markAsRead, markAllAsRead, createNotification } from '../services/notificationService.js';

const router = Router();

// GET /api/notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    return res.json(notifications);
  } catch (err) {
    console.error('[Notifications GET /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    await markAsRead(req.params.id, req.user.id);
    return res.json({ message: 'Marked as read', id: req.params.id });
  } catch (err) {
    console.error('[Notifications PUT /:id/read]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await markAllAsRead(req.user.id);
    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('[Notifications PUT /read-all]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/notifications (Officer / Admin broadcast)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, message, type, recipientId } = req.body;
    const notif = await createNotification({
      userId: recipientId || req.user.id,
      role: req.user.role,
      type: type || 'SYSTEM',
      title: title || 'Notice',
      message: message || ''
    });
    return res.status(201).json(notif);
  } catch (err) {
    console.error('[Notifications POST /]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
