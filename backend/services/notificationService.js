import Notification from '../models/Notification.js';
import User from '../models/User.js';

export async function createNotification({
  userId,
  role = 'OFFICER',
  type = 'SYSTEM',
  title,
  message,
  relatedEntity = null,
  relatedId = null
}) {
  const id = `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await Notification.create({ id, user_id: userId, role, type, title, message, related_entity: relatedEntity, related_id: relatedId, is_read: 0 });
  return { id, userId, role, type, title, message, relatedEntity, relatedId };
}

export async function notifyRole({
  role,
  type = 'SYSTEM',
  title,
  message,
  relatedEntity = null,
  relatedId = null
}) {
  const users = await User.find({ role, is_active: 1 }, { id: 1 }).lean();
  const created = [];
  for (const user of users) {
    created.push(await createNotification({ userId: user.id, role, type, title, message, relatedEntity, relatedId }));
  }
  return created;
}

export async function getUserNotifications(userId) {
  return Notification.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(50)
    .lean();
}

export async function markAsRead(notificationId, userId) {
  return Notification.updateOne({ id: notificationId, user_id: userId }, { $set: { is_read: 1 } });
}

export async function markAllAsRead(userId) {
  return Notification.updateMany({ user_id: userId }, { $set: { is_read: 1 } });
}
