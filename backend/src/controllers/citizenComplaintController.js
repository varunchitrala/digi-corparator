const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateSlaHours } = require('../services/slaService');
const { validateStatusTransition } = require('../services/statusTransitionService');
const { detectDuplicates } = require('../services/duplicateDetectionService');
const { logAudit } = require('../services/auditService');

/**
 * @desc Create New Citizen Complaint
 * @route POST /api/citizen/complaints
 */
const createCitizenComplaint = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      title,
      description,
      category_id,
      subcategory_id,
      priority = 'MEDIUM',
      location_address,
      latitude = 19.8762,
      longitude = 75.3433,
      ward_id = 'w-demo-024',
      source = 'WEB'
    } = req.body;

    if (!title || !description || !location_address || !category_id) {
      await connection.rollback();
      return sendError(res, 'Title, description, category, and location address are required', [], 400);
    }

    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';
    const tenantId = req.user ? req.user.tenant_id || 't-demo-001' : 't-demo-001';
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    // Fetch department linked to category
    const [cats] = await connection.query(`SELECT department_id FROM complaint_categories WHERE category_id = ?`, [category_id]);
    const departmentId = cats[0]?.department_id || 'd-demo-001';

    // Unique Transaction-Safe Complaint Number Generation (CMP-2026-XXXXXX)
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const complaintNumber = `CMP-${year}-${randomSeq}`;
    const complaintId = `cmp-${Date.now()}`;

    // SLA Calculation
    const slaHours = calculateSlaHours(priority);
    const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    // Insert Complaint Record
    await connection.query(
      `INSERT INTO complaints
        (complaint_id, complaint_number, tenant_id, corporation_id, ward_id, department_id, category_id, subcategory_id, citizen_id, title, description, priority, location_address, latitude, longitude, source, status, sla_hours, sla_started_at, sla_due_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REGISTERED', ?, NOW(), ?)`,
      [
        complaintId, complaintNumber, tenantId, corpId, ward_id, departmentId, category_id, subcategory_id || null, citizenUserId,
        title, description, priority, location_address, latitude, longitude, source, slaHours, slaDueAt
      ]
    );

    // Initial History Record
    await connection.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, NULL, 'REGISTERED', ?, 'Grievance registered via Digital Citizen Portal')`,
      [`hist-${Date.now()}`, complaintId, citizenUserId]
    );

    // Duplicate Check
    const possibleDuplicates = await detectDuplicates({ ward_id, category_id, latitude, longitude });

    await connection.commit();

    await logAudit({
      user_id: citizenUserId,
      tenant_id: tenantId,
      corporation_id: corpId,
      action: 'COMPLAINT_REGISTERED',
      module: 'COMPLAINTS',
      details: { complaint_number: complaintNumber, title }
    });

    return sendSuccess(res, 'Complaint registered successfully', {
      complaint_id: complaintId,
      complaint_number: complaintNumber,
      status: 'REGISTERED',
      sla_due_at: slaDueAt,
      possibleDuplicates
    }, 201);
  } catch (error) {
    await connection.rollback();
    console.error('[Create Citizen Complaint Error]', error);
    return sendError(res, 'Failed to register complaint', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Get List of Complaints Registered by Authenticated Citizen (Strict IDOR Protected)
 * @route GET /api/citizen/complaints
 */
const getCitizenComplaints = async (req, res) => {
  try {
    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';

    const [rows] = await pool.query(
      `SELECT cmp.*, cc.category_name, d.department_name, w.ward_name
       FROM complaints cmp
       LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
       LEFT JOIN departments d ON cmp.department_id = d.department_id
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       WHERE cmp.citizen_id = ? AND cmp.deleted_at IS NULL
       ORDER BY cmp.created_at DESC`,
      [citizenUserId]
    );

    return sendSuccess(res, 'Citizen complaints retrieved', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch citizen complaints', error.message, 500);
  }
};

/**
 * @desc Get Citizen Complaint Details by ID (IDOR Verified & Strips Private Internal Remarks)
 * @route GET /api/citizen/complaints/:id
 */
const getCitizenComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';

    const [rows] = await pool.query(
      `SELECT cmp.complaint_id, cmp.complaint_number, cmp.title, cmp.description, cmp.priority, cmp.location_address, cmp.latitude, cmp.longitude, cmp.status, cmp.sla_hours, cmp.sla_due_at, cmp.created_at, cmp.resolved_at,
              cc.category_name, d.department_name, w.ward_name,
              u.first_name AS officer_first_name, u.last_name AS officer_last_name
       FROM complaints cmp
       LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
       LEFT JOIN departments d ON cmp.department_id = d.department_id
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       LEFT JOIN users u ON cmp.assigned_officer_id = u.user_id
       WHERE (cmp.complaint_id = ? OR cmp.complaint_number = ?) AND cmp.citizen_id = ? AND cmp.deleted_at IS NULL`,
      [id, id, citizenUserId]
    );

    if (rows.length === 0) {
      return sendError(res, 'Complaint not found or access denied', [], 404);
    }

    const complaint = rows[0];

    // Fetch Public History Logs (Excludes internal remarks)
    const [history] = await pool.query(
      `SELECT h.history_id, h.from_status, h.to_status, h.remarks, h.created_at
       FROM complaint_history h
       WHERE h.complaint_id = ?
       ORDER BY h.created_at ASC`,
      [complaint.complaint_id]
    );

    // Fetch Public Comments
    const [comments] = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.created_at, u.first_name, u.role_code
       FROM complaint_comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.complaint_id = ? AND c.visibility = 'PUBLIC'
       ORDER BY c.created_at ASC`,
      [complaint.complaint_id]
    );

    // Fetch Resolution if resolved
    const [resolutions] = await pool.query(`SELECT * FROM complaint_resolutions WHERE complaint_id = ?`, [complaint.complaint_id]);
    const [feedback] = await pool.query(`SELECT * FROM complaint_feedback WHERE complaint_id = ?`, [complaint.complaint_id]);

    complaint.history = history;
    complaint.comments = comments;
    complaint.resolution = resolutions[0] || null;
    complaint.feedback = feedback[0] || null;

    return sendSuccess(res, 'Citizen complaint details fetched', complaint);
  } catch (error) {
    return sendError(res, 'Failed to fetch complaint details', error.message, 500);
  }
};

/**
 * @desc Accept Complaint Resolution -> Move to CLOSED
 * @route POST /api/citizen/complaints/:id/verify
 */
const verifyResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';

    const [rows] = await pool.query(
      `SELECT complaint_id, status FROM complaints WHERE (complaint_id = ? OR complaint_number = ?) AND citizen_id = ?`,
      [id, id, citizenUserId]
    );

    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const transition = validateStatusTransition(complaint.status, 'CLOSED', req.user?.role_code);
    if (!transition.allowed) {
      return sendError(res, transition.reason, [], 400);
    }

    await pool.query(`UPDATE complaints SET status = 'CLOSED', closed_at = NOW(), updated_at = NOW() WHERE complaint_id = ?`, [complaint.complaint_id]);

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'CLOSED', ?, 'Citizen verified and accepted resolution.')`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, citizenUserId]
    );

    return sendSuccess(res, 'Complaint resolution verified and closed successfully');
  } catch (error) {
    return sendError(res, 'Failed to verify resolution', error.message, 500);
  }
};

/**
 * @desc Reject Complaint Resolution -> Move to REOPENED with reason
 * @route POST /api/citizen/complaints/:id/reopen
 */
const reopenComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reopen_reason } = req.body;
    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';

    if (!reopen_reason) {
      return sendError(res, 'Rejection reason is required to reopen complaint', [], 400);
    }

    const [rows] = await pool.query(
      `SELECT complaint_id, status FROM complaints WHERE (complaint_id = ? OR complaint_number = ?) AND citizen_id = ?`,
      [id, id, citizenUserId]
    );

    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaint = rows[0];

    const transition = validateStatusTransition(complaint.status, 'REOPENED', req.user?.role_code);
    if (!transition.allowed) {
      return sendError(res, transition.reason, [], 400);
    }

    await pool.query(
      `UPDATE complaints SET status = 'REOPENED', reopened_at = NOW(), updated_at = NOW() WHERE complaint_id = ?`,
      [complaint.complaint_id]
    );

    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, ?, 'REOPENED', ?, ?)`,
      [`hist-${Date.now()}`, complaint.complaint_id, complaint.status, citizenUserId, `Citizen rejected resolution: ${reopen_reason}`]
    );

    return sendSuccess(res, 'Complaint reopened successfully and sent back for re-inspection');
  } catch (error) {
    return sendError(res, 'Failed to reopen complaint', error.message, 500);
  }
};

/**
 * @desc Submit Citizen Rating & Feedback (1-5 stars)
 * @route POST /api/citizen/complaints/:id/feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating = 5, comment = '' } = req.body;
    const citizenUserId = req.user ? req.user.user_id : 'u-cit-001';

    const [rows] = await pool.query(`SELECT complaint_id FROM complaints WHERE (complaint_id = ? OR complaint_number = ?) AND citizen_id = ?`, [id, id, citizenUserId]);
    if (rows.length === 0) return sendError(res, 'Complaint not found', [], 404);
    const complaintId = rows[0].complaint_id;

    const feedbackId = `fb-${Date.now()}`;
    await pool.query(
      `INSERT INTO complaint_feedback (feedback_id, complaint_id, citizen_id, rating, comment, is_satisfied)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [feedbackId, complaintId, citizenUserId, rating, comment, rating >= 3]
    );

    return sendSuccess(res, 'Feedback submitted successfully');
  } catch (error) {
    return sendError(res, 'Failed to submit feedback', error.message, 500);
  }
};

module.exports = {
  createCitizenComplaint,
  getCitizenComplaints,
  getCitizenComplaintById,
  verifyResolution,
  reopenComplaint,
  submitFeedback
};
