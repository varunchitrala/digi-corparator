const { pool } = require('../config/db');

/**
 * Server-Side Leave Quota & Balance Calculation
 */
const calculateLeaveBalance = async (employeeId, leaveTypeId) => {
  try {
    const [ltypes] = await pool.query(`SELECT annual_quota FROM leave_types WHERE leave_type_id = ?`, [leaveTypeId]);
    const quota = ltypes.length > 0 ? ltypes[0].annual_quota : 12;

    const [usedRows] = await pool.query(
      `SELECT COALESCE(SUM(days), 0) AS used_days
       FROM leave_applications
       WHERE employee_id = ? AND leave_type_id = ? AND status = 'APPROVED'`,
      [employeeId, leaveTypeId]
    );

    const used = parseInt(usedRows[0]?.used_days || 0, 10);
    const available = Math.max(0, quota - used);

    return { quota, used, available };
  } catch (err) {
    console.error('[Leave Balance Error]', err);
    return { quota: 12, used: 0, available: 12 };
  }
};

module.exports = {
  calculateLeaveBalance
};
