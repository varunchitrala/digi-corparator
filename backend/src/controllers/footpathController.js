const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Footpaths Register
 * @route GET /api/corporation/roads/footpaths
 */
const getFootpaths = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, r.road_name, w.ward_name
       FROM footpaths f
       JOIN roads r ON f.road_id = r.road_id
       LEFT JOIN wards w ON f.ward_id = w.ward_id
       ORDER BY f.created_at DESC`
    );
    return sendSuccess(res, 'Footpaths register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch footpaths', error.message, 500);
  }
};

module.exports = {
  getFootpaths
};
