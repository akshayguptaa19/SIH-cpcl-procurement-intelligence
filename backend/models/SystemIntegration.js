import mongoose from 'mongoose';

const systemIntegrationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gateway_type: { type: String, required: true },
  status: { type: String, default: 'OPERATIONAL' }, // 'OPERATIONAL', 'DEGRADED', 'UNAVAILABLE'
  endpoint: { type: String, required: true },
  response_time_ms: { type: Number, default: 120 },
  uptime_percentage: { type: Number, default: 99.98 },
  last_sync_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const SystemIntegration = mongoose.models.SystemIntegration || mongoose.model('SystemIntegration', systemIntegrationSchema);
export default SystemIntegration;
