import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  entity_type: { type: String, required: true }, // 'TENDER', 'BIDDER', 'APPLICATION'
  entity_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, default: 'INFO' }, // 'INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  confidence: { type: Number, default: 92.0 },
  evidence: String,
  recommendation: String,
  status: { type: String, default: 'ACTIVE' }, // 'ACTIVE', 'DISMISSED', 'ESCALATED'
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const AiInsight = mongoose.models.AiInsight || mongoose.model('AiInsight', aiInsightSchema);
export default AiInsight;
