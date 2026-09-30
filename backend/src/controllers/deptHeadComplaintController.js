const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Department Complaints Workspace
 * @route GET /api/department-head/complaints
 */
const getDeptHeadComplaints = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const deptId = req.user ? req.user.department_id || 'd-demo-001' : 'd-demo-001';

    const [rows] = await pool.query(
      `SELECT cmp.*, cc.category_name, w.ward_name, u.first_name AS officer_first_name, u.last_name AS officer_last_name
       FROM complaints cmp
       LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       LEFT JOIN users u ON cmp.assigned_officer_id = u.user_id
       WHERE cmp.corporation_id = ? AND cmp.department_id = ? AND cmp.deleted_at IS NULL
       ORDER BY cmp.priority DESC, cmp.created_at DESC`,
      [corpId, deptId]
    );

    return sendSuccess(res, 'Department complaints fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch department complaints', error.message, 500);
  }
};

/**
 * @desc Assign / Reassign Field Officer to Complaint
 * @route POST /api/department-head/complaints/:id/assign
 */
const assignOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { officer_id } = req.body;
    const performedById = req.user ? req.user.user_id : 'u-dept-001';

    if (!officer_id) return sendError(res, 'Officer ID is required', [], 400);

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    await pool.query(
      `UPDATE complaints SET assigned_officer_id = ?, status = 'ASSIGNED', updated_at = NOW() WHERE complaint_id = ?`,
      [officer_id, complaint.complaint_id]
    );

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'ASSIGNED', ?, ?)`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, performedById, `Assigned to Field Officer (ID: ${officer_id})`]
    );

    return sendSuccess(res, 'Officer assigned successfully');
  } catch (error) {
    return sendError(res, 'Failed to assign officer', error.message, 500);
  }
};

/**
 * @desc Manual Escalation of Complaint to Higher Tier
 * @route POST /api/department-head/complaints/:id/escalate
 */
const escalateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'High priority escalation requested' } = req.body;
    const performedById = req.user ? req.user.user_id : 'u-dept-001';

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    await pool.query(`UPDATE complaints SET status = 'ESCALATED', priority = 'CRITICAL', updated_at = NOW() WHERE complaint_id = ?`, [complaint.complaint_id]);

    await pool.query(
      `INSERT INTO complaint_escalations (escalation_id, complaint_id, escalated_from_user_id, escalated_to_user_id, escalation_level, reason)
       VALUES (?, ?, ?, 'u-corp-001', 2, ?)`,
      [`esc-${Date.now()}`, complaint.complaint_id, performedById, reason]
    );

    return sendSuccess(res, 'Complaint manually escalated to Corporation Admin');
  } catch (error) {
    return sendError(res, 'Failed to escalate complaint', error.message, 500);
  }
};

module.exports = {
  getDeptHeadComplaints,
  assignOfficer,
  escalateComplaint
};
