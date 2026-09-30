const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Disease Surveillance Records
 * @route GET /api/corporation/health/surveillance
 */
const getSurveillance = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT ds.*, w.ward_name
       FROM health_surveillance_records ds
       LEFT JOIN wards w ON ds.ward_id = w.ward_id
       WHERE ds.corporation_id = ?
       ORDER BY ds.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Disease surveillance records fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch surveillance records', error.message, 500);
  }
};

/**
 * @desc Log Aggregated Disease Surveillance Report (DSR-2026-XXXXXX)
 * @route POST /api/corporation/health/surveillance
 */
const createSurveillance = async (req, res) => {
  try {
    const { ward_id = 'w-demo-024', condition_category = 'VECTOR_BORNE', case_count = 8, severity_category = 'MEDIUM' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const dsrNum = `DSR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const dsrId = `dsr-${Date.now()}`;

    await pool.query(
      `INSERT INTO health_surveillance_records (surveillance_id, surveillance_number, corporation_id, ward_id, condition_category, case_count, severity_category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'REPORTED')`,
      [dsrId, dsrNum, corpId, ward_id, condition_category, parseInt(case_count), severity_category]
    );

    return sendSuccess(res, 'Disease surveillance report logged', { surveillance_id: dsrId, surveillance_number: dsrNum }, 201);
  } catch (error) {
    return sendError(res, 'Surveillance logging failed', error.message, 500);
  }
};

module.exports = {
  getSurveillance,
  createSurveillance
};
