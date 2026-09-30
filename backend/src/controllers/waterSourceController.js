const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Water Sources Register
 * @route GET /api/corporation/water/sources
 */
const getSources = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT ws.*
       FROM water_sources ws
       WHERE ws.corporation_id = ?
       ORDER BY ws.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Water sources master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch water sources', error.message, 500);
  }
};

/**
 * @desc Register New Water Source (WSRC-2026-XXXXXX)
 * @route POST /api/corporation/water/sources
 */
const createSource = async (req, res) => {
  try {
    const { source_name = 'Jayakwadi Dam Reservoir', source_type = 'DAM', capacity_mld = 450 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const srcNum = `WSRC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const srcId = `wsrc-${Date.now()}`;

    await pool.query(
      `INSERT INTO water_sources (source_id, source_code, corporation_id, source_name, source_type, capacity_mld, status)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [srcId, srcNum, corpId, source_name, source_type, parseFloat(capacity_mld)]
    );

    return sendSuccess(res, 'Water source registered successfully', { source_id: srcId, source_code: srcNum }, 201);
  } catch (error) {
    return sendError(res, 'Water source registration failed', error.message, 500);
  }
};

module.exports = {
  getSources,
  createSource
};
