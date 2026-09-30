const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Fogging Activities Register
 * @route GET /api/corporation/health/fogging
 */
const getFogging = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT f.*, w.ward_name
       FROM fogging_activities f
       LEFT JOIN wards w ON f.ward_id = w.ward_id
       WHERE f.corporation_id = ?
       ORDER BY f.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Fogging activities register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch fogging activities', error.message, 500);
  }
};

/**
 * @desc Schedule Fogging Activity (FOG-2026-XXXXXX)
 * @route POST /api/corporation/health/fogging
 */
const createFogging = async (req, res) => {
  try {
    const { ward_id = 'w-demo-024', fogging_date = '2026-08-28', route_name = 'Ward 24 Civil Lines Sector 3' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const fogNum = `FOG-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const fogId = `fog-${Date.now()}`;

    await pool.query(
      `INSERT INTO fogging_activities (fogging_id, fogging_number, corporation_id, ward_id, fogging_date, route_name, status)
       VALUES (?, ?, ?, ?, ?, ?, 'PLANNED')`,
      [fogId, fogNum, corpId, ward_id, fogging_date, route_name]
    );

    return sendSuccess(res, 'Fogging activity scheduled', { fogging_id: fogId, fogging_number: fogNum }, 201);
  } catch (error) {
    return sendError(res, 'Fogging scheduling failed', error.message, 500);
  }
};

module.exports = {
  getFogging,
  createFogging
};
