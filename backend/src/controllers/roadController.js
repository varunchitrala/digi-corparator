const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Roads Register
 * @route GET /api/corporation/roads
 */
const getRoads = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT r.*, w.ward_name
       FROM roads r
       LEFT JOIN wards w ON r.ward_id = w.ward_id
       WHERE r.corporation_id = ?
       ORDER BY r.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Roads master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch roads', error.message, 500);
  }
};

/**
 * @desc Register Municipal Road (ROAD-2026-XXXXXX)
 * @route POST /api/corporation/roads
 */
const createRoad = async (req, res) => {
  try {
    const { road_name = 'Civil Lines Main Road Ward 24', ward_id = 'w-demo-024', road_type = 'MAIN_ROAD', surface_type = 'BITUMEN', length_meters = 2500 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const rdNum = `ROAD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const rdId = `road-${Date.now()}`;

    await pool.query(
      `INSERT INTO roads (road_id, road_code, corporation_id, ward_id, road_name, road_type, surface_type, length_meters, \`condition\`, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'GOOD', 'ACTIVE')`,
      [rdId, rdNum, corpId, ward_id, road_name, road_type, surface_type, parseFloat(length_meters)]
    );

    return sendSuccess(res, 'Municipal road registered successfully', { road_id: rdId, road_code: rdNum }, 201);
  } catch (error) {
    return sendError(res, 'Road registration failed', error.message, 500);
  }
};

module.exports = {
  getRoads,
  createRoad
};
