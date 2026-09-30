const { pool } = require('../config/db');

/**
 * Immutable Audit Logger Service
 */
const logAudit = async ({
  user_id = null,
  tenant_id = null,
  corporation_id = null,
  action,
  module,
  details,
  ip_address = '127.0.0.1'
}) => {
  try {
    const logId = `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    await pool.query(
      `INSERT INTO audit_logs (log_id, tenant_id, user_id, action, module, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [logId, tenant_id, user_id, action, module, typeof details === 'object' ? JSON.stringify(details) : String(details), ip_address]
    );
  } catch (err) {
    console.error('[Audit Logger Error]', err.message);
  }
};

module.exports = {
  logAudit
};
