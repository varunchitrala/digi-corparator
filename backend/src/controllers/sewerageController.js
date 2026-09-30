const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Sewerage Facilities & STPs
 * @route GET /api/corporation/sewerage/stp
 */
const getSTPs = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT stp.*
       FROM stp_facilities stp
       WHERE stp.corporation_id = ?
       ORDER BY stp.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'STP facilities fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch STPs', error.message, 500);
  }
};

module.exports = {
  getSTPs
};
