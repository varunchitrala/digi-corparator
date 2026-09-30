const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get List of Complaints (Filtered by Ward/Status/Priority)
 * @route GET /api/complaints
 */
const getComplaints = async (req, res) => {
  try {
    const { ward_id, status, priority, category_id, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT cmp.*,
             cc.category_name,
             w.ward_name,
             w.ward_number,
             d.department_name,
             u.first_name AS officer_first_name, u.last_name AS officer_last_name,
             c.full_name AS citizen_name, c.mobile_number AS citizen_phone
      FROM complaints cmp
      LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
      LEFT JOIN wards w ON cmp.ward_id = w.ward_id
      LEFT JOIN departments d ON cmp.department_id = d.department_id
      LEFT JOIN users u ON cmp.assigned_officer_id = u.user_id
      LEFT JOIN citizens c ON cmp.citizen_id = c.citizen_id
      WHERE 1=1
    `;

    const params = [];

    if (ward_id) {
      query += ` AND cmp.ward_id = ?`;
      params.push(ward_id);
    }
    if (status) {
      query += ` AND cmp.status = ?`;
      params.push(status);
    }
    if (priority) {
      query += ` AND cmp.priority = ?`;
      params.push(priority);
    }
    if (category_id) {
      query += ` AND cmp.category_id = ?`;
      params.push(category_id);
    }
    if (search) {
      query += ` AND (cmp.complaint_number LIKE ? OR cmp.title LIKE ? OR cmp.location_address LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY cmp.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, params);

    // Get total count for pagination
    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM complaints`);

    return sendSuccess(res, 'Complaints list retrieved', rows, 200, {
      total: countRows[0].total,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
  } catch (error) {
    console.error('[Complaints Controller Error]', error);
    return sendError(res, 'Failed to fetch complaints', error.message, 500);
  }
};

/**
 * @desc Get Complaint Details by ID
 * @route GET /api/complaints/:id
 */
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT cmp.*,
              cc.category_name,
              w.ward_name, w.ward_number,
              d.department_name,
              u.first_name AS officer_first_name, u.last_name AS officer_last_name, u.email AS officer_email
       FROM complaints cmp
       LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       LEFT JOIN departments d ON cmp.department_id = d.department_id
       LEFT JOIN users u ON cmp.assigned_officer_id = u.user_id
       WHERE cmp.complaint_id = ? OR cmp.complaint_number = ?`,
      [id, id]
    );

    if (rows.length === 0) {
      return sendError(res, 'Complaint not found', [], 404);
    }

    const complaint = rows[0];

    // Fetch complaint status history logs
    const [historyRows] = await pool.query(
      `SELECT h.*, u.first_name, u.last_name, u.role_code
       FROM complaint_history h
       LEFT JOIN users u ON h.performed_by_id = u.user_id
       WHERE h.complaint_id = ?
       ORDER BY h.created_at ASC`,
      [complaint.complaint_id]
    );

    complaint.history = historyRows;

    return sendSuccess(res, 'Complaint details retrieved', complaint);
  } catch (error) {
    return sendError(res, 'Failed to fetch complaint details', error.message, 500);
  }
};

/**
 * @desc Create New Complaint
 * @route POST /api/complaints
 */
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      ward_id = 'w-demo-024',
      department_id = 'd-demo-002',
      category_id = 'cat-001',
      priority = 'MEDIUM',
      location_address,
      latitude = 19.8762,
      longitude = 75.3433
    } = req.body;

    if (!title || !description || !location_address) {
      return sendError(res, 'Title, description, and location address are required', [], 400);
    }

    const complaintId = `cmp-${Date.now()}`;
    const complaintNumber = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const tenantId = req.user ? req.user.tenant_id || 't-demo-001' : 't-demo-001';
    const corporationId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const citizenId = req.user ? req.user.user_id || 'u-cit-001' : 'u-cit-001';

    // Calculate SLA due date (Default 24 to 48 hours)
    const slaHours = priority === 'CRITICAL' ? 12 : priority === 'HIGH' ? 24 : 48;
    const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO complaints
        (complaint_id, complaint_number, tenant_id, corporation_id, ward_id, department_id, category_id, citizen_id, title, description, priority, location_address, latitude, longitude, status, sla_hours, sla_due_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REGISTERED', ?, ?)`,
      [
        complaintId,
        complaintNumber,
        tenantId,
        corporationId,
        ward_id,
        department_id,
        category_id,
        citizenId,
        title,
        description,
        priority,
        location_address,
        latitude,
        longitude,
        slaHours,
        slaDueAt
      ]
    );

    // Record initial history log
    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, ?, NULL, 'REGISTERED', ?, 'Complaint registered via Digital Portal')`,
      [`hist-${Date.now()}`, complaintId, citizenId]
    );

    return sendSuccess(res, 'Complaint registered successfully', {
      complaint_id: complaintId,
      complaint_number: complaintNumber,
      status: 'REGISTERED',
      sla_due_at: slaDueAt
    }, 201);
  } catch (error) {
    console.error('[Create Complaint Error]', error);
    return sendError(res, 'Failed to register complaint', error.message, 500);
  }
};

/**
 * @desc Update Complaint Status
 * @route PUT /api/complaints/:id/status
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks = '' } = req.body;

    if (!status) {
      return sendError(res, 'Target status is required', [], 400);
    }

    const [rows] = await pool.query(`SELECT status FROM complaints WHERE complaint_id = ? OR complaint_number = ?`, [id, id]);
    if (rows.length === 0) {
      return sendError(res, 'Complaint not found', [], 404);
    }

    const fromStatus = rows[0].status;
    const performedById = req.user ? req.user.user_id : 'u-corp-024';

    await pool.query(
      `UPDATE complaints
       SET status = ?, updated_at = NOW() ${status === 'RESOLVED' ? ', resolved_at = NOW()' : ''}
       WHERE complaint_id = ? OR complaint_number = ?`,
      [status, id, id]
    );

    // Insert history audit log
    await pool.query(
      `INSERT INTO complaint_history (history_id, complaint_id, from_status, to_status, performed_by_id, remarks)
       VALUES (?, (SELECT complaint_id FROM complaints WHERE complaint_id = ? OR complaint_number = ? LIMIT 1), ?, ?, ?, ?)`,
      [`hist-${Date.now()}`, id, id, fromStatus, status, performedById, remarks]
    );

    return sendSuccess(res, `Complaint status updated to ${status}`, { status });
  } catch (error) {
    return sendError(res, 'Failed to update complaint status', error.message, 500);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus
};
