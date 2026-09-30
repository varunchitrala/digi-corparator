const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Health Camps Register
 * @route GET /api/corporation/health/camps
 */
const getCamps = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT c.*, w.ward_name
       FROM health_camps c
       LEFT JOIN wards w ON c.ward_id = w.ward_id
       WHERE c.corporation_id = ?
       ORDER BY c.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Health camps register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch health camps', error.message, 500);
  }
};

/**
 * @desc Schedule Health Camp (CAMP-2026-XXXXXX)
 * @route POST /api/corporation/health/camps
 */
const createCamp = async (req, res) => {
  try {
    const { camp_name = 'Ward 24 Monsoon Vector Control & Dengue Camp', ward_id = 'w-demo-024', camp_type = 'HEALTH_SCREENING', camp_date = '2026-08-28' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const campNum = `CAMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const campId = `camp-${Date.now()}`;

    await pool.query(
      `INSERT INTO health_camps (camp_id, camp_code, corporation_id, ward_id, camp_name, camp_type, camp_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')`,
      [campId, campNum, corpId, ward_id, camp_name, camp_type, camp_date]
    );

    return sendSuccess(res, 'Health camp scheduled successfully', { camp_id: campId, camp_code: campNum }, 201);
  } catch (error) {
    return sendError(res, 'Camp scheduling failed', error.message, 500);
  }
};

module.exports = {
  getCamps,
  createCamp
};
