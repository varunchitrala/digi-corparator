const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Storm Water Drains Master
 * @route GET /api/corporation/drainage/drains
 */
const getDrains = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT d.*, w.ward_name
       FROM drains d
       LEFT JOIN wards w ON d.ward_id = w.ward_id
       WHERE d.corporation_id = ?
       ORDER BY d.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Storm water drains fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch drains', error.message, 500);
  }
};

module.exports = {
  getDrains
};
