import crypto from 'node:crypto';
import AuditLog from '../models/AuditLog.js';

export function createAuditHash(previousHash, action, entityId, userId, timestamp, details) {
  const content = `${previousHash || 'GENESIS_BLOCK_CPCL_PROCUREMENT_2026'}:${action}:${entityId}:${userId || 'SYSTEM'}:${timestamp}:${JSON.stringify(details || '')}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function logAuditAction({
  userId = null,
  userName = 'System Automated Service',
  userRole = 'SYSTEM',
  action,
  entityType,
  entityId,
  previousState = '—',
  newState = '—',
  ipAddress = '10.42.18.91 (CPCL-SECURE-NET)',
  source = 'CPCL_COMPLIANCE_ENGINE',
  details = ''
}) {
  try {
    const lastLog = await AuditLog.findOne({}, {}, { sort: { _id: -1 } });
    const previousHash = lastLog ? lastLog.hash : 'GENESIS_BLOCK_CPCL_PROCUREMENT_2026';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hash = createAuditHash(previousHash, action, entityId, userId, timestamp, details);
    const id = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await AuditLog.create({
      id,
      timestamp,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action,
      entity_type: entityType,
      entity_id: entityId,
      previous_state: previousState,
      new_state: newState,
      hash,
      ip_address: ipAddress,
      source,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details)
    });

    return { id, hash, timestamp };
  } catch (error) {
    console.error('Failed to write audit log:', error);
    return null;
  }
}

export async function getAuditLogs({ limit = 50, offset = 0, entityType, entityId, action } = {}) {
  const filter = {};
  if (entityType) filter.entity_type = entityType;
  if (entityId) filter.entity_id = entityId;
  if (action) filter.action = action;

  return AuditLog.find(filter)
    .sort({ _id: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();
}
