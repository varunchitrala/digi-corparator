const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Road Cutting Applications
 * @route GET /api/corporation/roads/cutting
 */
const getCuttingApplications = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT c.*, r.road_name
       FROM road_cutting_applications c
       JOIN roads r ON c.road_id = r.road_id
       WHERE c.corporation_id = ?
       ORDER BY c.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Road cutting applications fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch applications', error.message, 500);
  }
};

/**
 * @desc Apply for Road Cutting Permission (RCUT-2026-XXXXXX)
 * @route POST /api/corporation/roads/cutting
 */
const createCuttingApplication = async (req, res) => {
  try {
    const { road_id = 'road-001', ward_id = 'w-demo-024', agency = 'MSEDCL Electricity', purpose = 'Underground Cable Laying', cut_length_meters = 50, cut_width_meters = 1.2 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const rcutNum = `RCUT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const rcutId = `rcut-${Date.now()}`;

    await pool.query(
      `INSERT INTO road_cutting_applications (application_id, application_number, corporation_id, ward_id, road_id, agency, purpose, cut_length_meters, cut_width_meters, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')`,
      [rcutId, rcutNum, corpId, ward_id, road_id, agency, purpose, parseFloat(cut_length_meters), parseFloat(cut_width_meters)]
    );

    return sendSuccess(res, 'Road cutting permission application submitted', { application_id: rcutId, application_number: rcutNum }, 201);
  } catch (error) {
    return sendError(res, 'Application submission failed', error.message, 500);
  }
};

/**
 * @desc Approve Road Cutting Permission with Security Check
 * @route POST /api/corporation/roads/cutting/:id/approve
 */
const approveCuttingApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user ? req.user.role_code || req.user.role : 'CORPORATION_ADMIN';

    const allowedRoles = ['CORPORATION_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'OFFICER'];
    if (!allowedRoles.includes(userRole)) {
      return sendError(res, 'Unauthorized Guard: Only municipal engineers and corporation admins can approve road cutting permissions.', [], 403);
    }

    await pool.query(`UPDATE road_cutting_applications SET status = 'APPROVED' WHERE application_id = ?`, [id]);

    return sendSuccess(res, 'Road cutting permission approved successfully', { application_id: id, status: 'APPROVED' });
  } catch (error) {
    return sendError(res, 'Approval failed', error.message, 500);
  }
};

module.exports = {
  getCuttingApplications,
  createCuttingApplication,
  approveCuttingApplication
};
