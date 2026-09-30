const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Pipeline Leakages Register
 * @route GET /api/corporation/water/leakages
 */
const getLeakages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, p.pipeline_name, w.ward_name
       FROM water_leakages l
       JOIN water_pipelines p ON l.pipeline_id = p.pipeline_id
       LEFT JOIN wards w ON l.ward_id = w.ward_id
       ORDER BY l.created_at DESC`
    );
    return sendSuccess(res, 'Water leakages register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch leakages', error.message, 500);
  }
};

/**
 * @desc Report Pipeline Leakage (LEAK-2026-XXXXXX)
 * @route POST /api/corporation/water/leakages
 */
const createLeakage = async (req, res) => {
  try {
    const { pipeline_id = 'pipe-001', ward_id = 'w-demo-024', severity = 'MEDIUM', description = 'Pipeline joint leakage near Plot 45' } = req.body;

    const leakNum = `LEAK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const leakId = `leak-${Date.now()}`;

    await pool.query(
      `INSERT INTO water_leakages (leakage_id, leakage_number, pipeline_id, ward_id, severity, description, status)
       VALUES (?, ?, ?, ?, ?, ?, 'REPORTED')`,
      [leakId, leakNum, pipeline_id, ward_id, severity, description]
    );

    return sendSuccess(res, 'Pipeline leakage incident logged', { leakage_id: leakId, leakage_number: leakNum }, 201);
  } catch (error) {
    return sendError(res, 'Leakage logging failed', error.message, 500);
  }
};

module.exports = {
  getLeakages,
  createLeakage
};
