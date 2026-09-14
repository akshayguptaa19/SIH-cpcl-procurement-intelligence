import crypto from 'node:crypto';
import db from '../db/database.js';

export function createAuditHash(previousHash, action, entityId, userId, timestamp, details) {
  const content = `${previousHash || 'GENESIS_BLOCK_CPCL_PROCUREMENT_2026'}:${action}:${entityId}:${userId || 'SYSTEM'}:${timestamp}:${JSON.stringify(details || '')}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function logAuditAction({
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
    const lastLog = db.queryOne('SELECT hash FROM audit_logs ORDER BY rowid DESC LIMIT 1');
    const previousHash = lastLog ? lastLog.hash : 'GENESIS_BLOCK_CPCL_PROCUREMENT_2026';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hash = createAuditHash(previousHash, action, entityId, userId, timestamp, details);
    const id = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    db.execute(
      `INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, entity_type, entity_id, previous_state, new_state, hash, ip_address, source, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, timestamp, userId, userName, userRole, action, entityType, entityId, previousState, newState, hash, ipAddress, source, typeof details === 'object' ? JSON.stringify(details) : String(details)]
    );

    return { id, hash, timestamp };
  } catch (error) {
    console.error('Failed to write audit log:', error);
    return null;
  }
}

export function getAuditLogs({ limit = 50, offset = 0, entityType, entityId, action } = {}) {
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = [];

  if (entityType) {
    query += ' AND entity_type = ?';
    params.push(entityType);
  }
  if (entityId) {
    query += ' AND entity_id = ?';
    params.push(entityId);
  }
  if (action) {
    query += ' AND action = ?';
    params.push(action);
  }

  query += ' ORDER BY rowid DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.query(query, params);
}
