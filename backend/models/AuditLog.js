import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  user_id: String,
  user_name: { type: String, default: 'System Automated Service' },
  user_role: { type: String, default: 'SYSTEM' },
  action: { type: String, required: true },
  entity_type: String,
  entity_id: String,
  previous_state: { type: String, default: '—' },
  new_state: { type: String, default: '—' },
  hash: { type: String, required: true },
  ip_address: { type: String, default: '10.42.18.91 (CPCL-SECURE-NET)' },
  source: { type: String, default: 'CPCL_COMPLIANCE_ENGINE' },
  details: String
}, {
  // No createdAt since we manage `timestamp` manually for chain integrity
  timestamps: false
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
