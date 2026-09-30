const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Collection Routes Register
 * @route GET /api/corporation/waste/routes
 */
const getRoutes = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT r.*, w.ward_name
       FROM waste_routes r
       LEFT JOIN wards w ON r.ward_id = w.ward_id
       WHERE r.corporation_id = ?
       ORDER BY r.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Collection routes master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch collection routes', error.message, 500);
  }
};

/**
 * @desc Create Waste Collection Route (ROUTE-2026-XXXXXX)
 * @route POST /api/corporation/waste/routes
 */
const createRoute = async (req, res) => {
  try {
    const { route_name = 'Ward 24 Morning Sanitation Route', ward_id = 'w-demo-024', distance_km = 6.5 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const rtNum = `ROUTE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const rtId = `rt-${Date.now()}`;

    await pool.query(
      `INSERT INTO waste_routes (route_id, route_number, corporation_id, ward_id, route_name, distance_km, status)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [rtId, rtNum, corpId, ward_id, route_name, parseFloat(distance_km)]
    );

    return sendSuccess(res, 'Collection route created successfully', { route_id: rtId, route_number: rtNum }, 201);
  } catch (error) {
    return sendError(res, 'Route creation failed', error.message, 500);
  }
};

module.exports = {
  getRoutes,
  createRoute
};
