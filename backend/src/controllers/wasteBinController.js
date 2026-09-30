const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Smart Bins Master Register
 * @route GET /api/corporation/waste/bins
 */
const getBins = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT b.*, w.ward_name
       FROM waste_bin_profiles b
       LEFT JOIN wards w ON b.ward_id = w.ward_id
       WHERE b.corporation_id = ?
       ORDER BY b.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Smart bin directory fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch smart bins', error.message, 500);
  }
};

/**
 * @desc Public QR Smart Bin Telemetry
 * @route GET /api/public/waste/bin/:binCode
 */
const getPublicBinTelemetry = async (req, res) => {
  try {
    const { binCode } = req.params;

    const [rows] = await pool.query(
      `SELECT b.bin_code, b.bin_type, b.capacity_liters, b.fill_level_percent, b.address, b.status, w.ward_name
       FROM waste_bin_profiles b
       LEFT JOIN wards w ON b.ward_id = w.ward_id
       WHERE b.bin_code = ?`,
      [binCode]
    );

    if (rows.length === 0) return sendError(res, 'Smart bin not found', [], 404);
    return sendSuccess(res, 'Public smart bin telemetry fetched', rows[0]);
  } catch (error) {
    return sendError(res, 'Failed to fetch bin telemetry', error.message, 500);
  }
};

module.exports = {
  getBins,
  getPublicBinTelemetry
};
