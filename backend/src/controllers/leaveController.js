const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateLeaveBalance } = require('../services/leaveCalculationService');

/**
 * @desc Get Leave Applications List
 * @route GET /api/hrms/leave/applications
 */
const getLeaveApplications = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT l.*, e.employee_code, p.first_name, p.last_name, lt.leave_name
       FROM leave_applications l
       JOIN employees e ON l.employee_id = e.employee_id
       JOIN employee_personal_details p ON e.employee_id = p.employee_id
       JOIN leave_types lt ON l.leave_type_id = lt.leave_type_id
       WHERE e.corporation_id = ?
       ORDER BY l.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Leave applications fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch leave applications', error.message, 500);
  }
};

/**
 * @desc Apply for Leave & Verify Server-Side Balance
 * @route POST /api/hrms/leave/apply
 */
const applyLeave = async (req, res) => {
  try {
    const { employee_id = 'emp-001', leave_type_id = 'ltype-001', from_date = '2026-09-01', to_date = '2026-09-03', days = 3, reason = 'Personal leave' } = req.body;

    // Verify Available Balance
    const balance = await calculateLeaveBalance(employee_id, leave_type_id);
    if (balance.available < parseInt(days, 10)) {
      return sendError(res, `Insufficient Leave Balance: You have ${balance.available} days available (Requested: ${days} days).`, [], 400);
    }

    const lappId = `lapp-${Date.now()}`;
    await pool.query(
      `INSERT INTO leave_applications (leave_app_id, employee_id, leave_type_id, from_date, to_date, days, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')`,
      [lappId, employee_id, leave_type_id, from_date, to_date, parseInt(days, 10), reason]
    );

    return sendSuccess(res, 'Leave application submitted successfully', { leave_app_id: lappId, remaining_balance: balance.available - parseInt(days, 10) }, 201);
  } catch (error) {
    return sendError(res, 'Leave application failed', error.message, 500);
  }
};

/**
 * @desc Approve Leave Application
 * @route POST /api/hrms/leave/applications/:id/approve
 */
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    await pool.query(`UPDATE leave_applications SET status = 'APPROVED', approved_by_id = ? WHERE leave_app_id = ?`, [userId, id]);
    return sendSuccess(res, 'Leave application approved');
  } catch (error) {
    return sendError(res, 'Leave approval failed', error.message, 500);
  }
};

module.exports = {
  getLeaveApplications,
  applyLeave,
  approveLeave
};
