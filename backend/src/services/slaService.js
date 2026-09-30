const { pool } = require('../config/db');

/**
 * Calculate SLA Deadline date based on priority
 */
const calculateSlaHours = (priority = 'MEDIUM') => {
  switch (priority) {
    case 'CRITICAL': return 12;
    case 'HIGH': return 24;
    case 'MEDIUM': return 48;
    case 'LOW': return 72;
    default: return 48;
  }
};

/**
 * Scan database for breached SLAs and mark as ESCALATED
 */
const checkSlaBreaches = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT complaint_id, complaint_number, ward_id, priority, sla_due_at
       FROM complaints
       WHERE status NOT IN ('RESOLVED', 'CITIZEN_VERIFICATION', 'CLOSED', 'REJECTED', 'CANCELLED', 'ESCALATED')
         AND sla_due_at IS NOT NULL
         AND sla_due_at < NOW()`
    );

    for (const cmp of rows) {
      await pool.query(`UPDATE complaints SET status = 'ESCALATED', updated_at = NOW() WHERE complaint_id = ?`, [cmp.complaint_id]);
      await pool.query(
        `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
         VALUES (?, ?, 'IN_PROGRESS', 'ESCALATED', 'SYSTEM', 'Automated SLA breach escalation triggered by system background scanner')`,
        [`hist-${Date.now()}-${cmp.complaint_id}`, cmp.complaint_id]
      );
    }
    return rows.length;
  } catch (err) {
    console.error('[SLA Service Error]', err.message);
    return 0;
  }
};

module.exports = {
  calculateSlaHours,
  checkSlaBreaches
};
