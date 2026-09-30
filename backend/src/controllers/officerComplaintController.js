const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateStatusTransition } = require('../services/statusTransitionService');
const { logAudit } = require('../services/auditService');

/**
 * @desc Get Complaints Assigned to Authenticated Field Officer
 * @route GET /api/officer/complaints
 */
const getOfficerComplaints = async (req, res) => {
  try {
    const officerId = req.user ? req.user.user_id : 'u-dept-001';
    const { status } = req.query;

    let query = `
      SELECT cmp.*, cc.category_name, d.department_name, w.ward_name, c.full_name AS citizen_name, c.mobile_number AS citizen_phone
      FROM complaints cmp
      LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
      LEFT JOIN departments d ON cmp.department_id = d.department_id
      LEFT JOIN wards w ON cmp.ward_id = w.ward_id
      LEFT JOIN citizens c ON cmp.citizen_id = c.citizen_id
      WHERE cmp.assigned_officer_id = ? AND cmp.deleted_at IS NULL
    `;

    const params = [officerId];

    if (status) {
      query += ` AND cmp.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY cmp.priority DESC, cmp.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return sendSuccess(res, 'Assigned complaints fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch assigned complaints', error.message, 500);
  }
};

/**
 * @desc Field Officer Accepts Assigned Complaint (ASSIGNED -> ACCEPTED)
 * @route PATCH /api/officer/complaints/:id/accept
 */
const acceptComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const officerId = req.user ? req.user.user_id : 'u-dept-001';

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const transition = validateStatusTransition(complaint.status, 'ACCEPTED', req.user?.role_code);
    if (!transition.allowed) return sendError(res, transition.reason, [], 400);

    await pool.query(`UPDATE complaints SET status = 'ACCEPTED', updated_at = NOW() WHERE complaint_id = ?`, [complaint.complaint_id]);

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'ACCEPTED', ?, 'Field Officer accepted grievance assignment')`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, officerId]
    );

    return sendSuccess(res, 'Complaint accepted by field officer');
  } catch (error) {
    return sendError(res, 'Failed to accept complaint', error.message, 500);
  }
};

/**
 * @desc Submit Site Inspection Report & Findings
 * @route POST /api/officer/complaints/:id/inspection
 */
const submitInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, findings, recommendation = 'PROCEED_WORK', inspection_result = 'VALID', latitude, longitude } = req.body;
    const officerId = req.user ? req.user.user_id : 'u-dept-001';

    if (!remarks) return sendError(res, 'Inspection remarks are required', [], 400);

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const inspectionId = `insp-${Date.now()}`;
    await pool.query(
      `INSERT INTO complaint_inspections (inspection_id, complaint_id, officer_id, inspection_date, inspection_time, latitude, longitude, remarks, findings, recommendation, inspection_result)
       VALUES (?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, ?)`,
      [inspectionId, complaint.complaint_id, officerId, latitude || 19.8762, longitude || 75.3433, remarks, findings || '', recommendation, inspection_result]
    );

    // Update complaint status to INSPECTION_COMPLETED or IN_PROGRESS
    await pool.query(`UPDATE complaints SET status = 'INSPECTION_COMPLETED', updated_at = NOW() WHERE complaint_id = ?`, [complaint.complaint_id]);

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'INSPECTION_COMPLETED', ?, ?)`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, officerId, `On-site inspection completed: ${remarks}`]
    );

    return sendSuccess(res, 'Site inspection report saved successfully', { inspection_id: inspectionId });
  } catch (error) {
    return sendError(res, 'Failed to submit inspection report', error.message, 500);
  }
};

/**
 * @desc Update Field Work Progress (0 - 100%)
 * @route POST /api/officer/complaints/:id/progress
 */
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_percentage, remarks, estimated_completion_date } = req.body;
    const officerId = req.user ? req.user.user_id : 'u-dept-001';

    if (progress_percentage === undefined || progress_percentage < 0 || progress_percentage > 100) {
      return sendError(res, 'Valid progress percentage (0 - 100) is required', [], 400);
    }

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const progressId = `prog-${Date.now()}`;
    await pool.query(
      `INSERT INTO complaint_progress (progress_id, complaint_id, officer_id, progress_percentage, remarks, estimated_completion_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [progressId, complaint.complaint_id, officerId, progress_percentage, remarks || 'Work in progress', estimated_completion_date || null]
    );

    // Move status to IN_PROGRESS if not already
    if (complaint.status !== 'IN_PROGRESS') {
      await pool.query(`UPDATE complaints SET status = 'IN_PROGRESS', updated_at = NOW() WHERE complaint_id = ?`, [complaint.complaint_id]);
    }

    return sendSuccess(res, `Work progress updated to ${progress_percentage}%`);
  } catch (error) {
    return sendError(res, 'Failed to update progress', error.message, 500);
  }
};

/**
 * @desc Submit Final Resolution (Move status -> RESOLVED -> CITIZEN_VERIFICATION)
 * @route POST /api/officer/complaints/:id/resolve
 */
const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_type = 'RESOLVED', resolution_description, resolution_cost = 0, remarks } = req.body;
    const officerId = req.user ? req.user.user_id : 'u-dept-001';

    if (!resolution_description) {
      return sendError(res, 'Resolution description is required', [], 400);
    }

    const [rows] = await pool.query(`SELECT complaint_id, status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const resolutionId = `res-${Date.now()}`;
    await pool.query(
      `INSERT INTO complaint_resolutions (resolution_id, complaint_id, officer_id, resolution_type, resolution_description, resolution_cost, resolved_at, remarks)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [resolutionId, complaint.complaint_id, officerId, resolution_type, resolution_description, resolution_cost, remarks || '']
    );

    // Transition to CITIZEN_VERIFICATION
    await pool.query(
      `UPDATE complaints SET status = 'CITIZEN_VERIFICATION', resolved_at = NOW(), updated_at = NOW() WHERE complaint_id = ?`,
      [complaint.complaint_id]
    );

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'CITIZEN_VERIFICATION', ?, ?)`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, officerId, `Work completed: ${resolution_description}`]
    );

    return sendSuccess(res, 'Complaint resolved and submitted for citizen verification');
  } catch (error) {
    return sendError(res, 'Failed to resolve complaint', error.message, 500);
  }
};

module.exports = {
  getOfficerComplaints,
  acceptComplaint,
  submitInspection,
  updateProgress,
  resolveComplaint
};
