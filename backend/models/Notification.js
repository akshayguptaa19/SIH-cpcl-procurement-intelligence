import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  role: { type: String, default: 'OFFICER' },
  type: { type: String, default: 'SYSTEM' },
  title: String,
  message: String,
  related_entity: String,
  related_id: String,
  is_read: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
