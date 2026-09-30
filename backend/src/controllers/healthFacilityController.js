const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Health Facilities Master
 * @route GET /api/corporation/health/facilities
 */
const getFacilities = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT hf.*, w.ward_name
       FROM health_facilities hf
       LEFT JOIN wards w ON hf.ward_id = w.ward_id
       WHERE hf.corporation_id = ?
       ORDER BY hf.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Health facilities master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch facilities', error.message, 500);
  }
};

/**
 * @desc Register Health Facility (HF-2026-XXXXXX)
 * @route POST /api/corporation/health/facilities
 */
const createFacility = async (req, res) => {
  try {
    const { facility_name = 'Ward 24 Primary Urban Health Centre', ward_id = 'w-demo-024', facility_type = 'URBAN_HEALTH_CENTRE', capacity_beds = 25 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const hfNum = `HF-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const hfId = `hf-${Date.now()}`;

    await pool.query(
      `INSERT INTO health_facilities (facility_id, facility_code, corporation_id, ward_id, facility_name, facility_type, capacity_beds, operating_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [hfId, hfNum, corpId, ward_id, facility_name, facility_type, parseInt(capacity_beds)]
    );

    return sendSuccess(res, 'Health facility registered successfully', { facility_id: hfId, facility_code: hfNum }, 201);
  } catch (error) {
    return sendError(res, 'Facility registration failed', error.message, 500);
  }
};

module.exports = {
  getFacilities,
  createFacility
};
