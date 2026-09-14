import db from '../db/database.js';

export function createNotification({
  userId,
  role = 'OFFICER',
  type = 'SYSTEM', // 'DEADLINE', 'VERIFICATION', 'CLARIFICATION', 'RISK_ALERT', 'SYSTEM'
  title,
  message,
  relatedEntity = null,
  relatedId = null
}) {
  const id = `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  db.execute(
    `INSERT INTO notifications (id, user_id, role, type, title, message, related_entity, related_id, is_read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [id, userId, role, type, title, message, relatedEntity, relatedId]
  );
  return { id, userId, role, type, title, message, relatedEntity, relatedId };
}

export function notifyRole({
  role,
  type = 'SYSTEM',
  title,
  message,
  relatedEntity = null,
  relatedId = null
}) {
  const users = db.query('SELECT id FROM users WHERE role = ? AND is_active = 1', [role]);
  const created = [];
  for (const user of users) {
    created.push(createNotification({
      userId: user.id,
      role,
      type,
      title,
      message,
      relatedEntity,
      relatedId
    }));
  }
  return created;
}

export function getUserNotifications(userId) {
  return db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
}

export function markAsRead(notificationId, userId) {
  return db.execute(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [notificationId, userId]
  );
}

export function markAllAsRead(userId) {
  return db.execute(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
    [userId]
  );
}
