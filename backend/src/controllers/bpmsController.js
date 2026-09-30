const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Building Applications
 * @route GET /api/corporation/bpms/applications
 */
const getBpApplications = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT ba.*, w.ward_name
       FROM building_applications ba
       LEFT JOIN wards w ON ba.ward_id = w.ward_id
       WHERE ba.corporation_id = ?
       ORDER BY ba.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Building applications fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch building applications', error.message, 500);
  }
};

/**
 * @desc Submit Building Application (BP-2026-XXXXXX)
 * @route POST /api/corporation/bpms/applications
 */
const createBpApplication = async (req, res) => {
  try {
    const { applicant_name = 'Ramesh Sharma', architect_name = 'Shree Architects Ward 24', ward_id = 'w-demo-024', plot_number = 'Plot 45', cts_number = 'CTS-8842', building_type = 'RESIDENTIAL', total_builtup_sqft = 3200 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const bpNum = `BP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const bpId = `bp-${Date.now()}`;
    const feeAmount = parseFloat(total_builtup_sqft) * 5.0;

    await pool.query(
      `INSERT INTO building_applications (bp_application_id, bp_number, corporation_id, ward_id, applicant_name, architect_name, plot_number, cts_number, building_type, total_builtup_sqft, scrutiny_fee_amount, stage, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', 'ACTIVE')`,
      [bpId, bpNum, corpId, ward_id, applicant_name, architect_name, plot_number, cts_number, building_type, total_builtup_sqft, feeAmount]
    );

    return sendSuccess(res, 'Building application submitted successfully', { bp_application_id: bpId, bp_number: bpNum, fee_amount: feeAmount }, 201);
  } catch (error) {
    return sendError(res, 'Application submission failed', error.message, 500);
  }
};

module.exports = {
  getBpApplications,
  createBpApplication
};
