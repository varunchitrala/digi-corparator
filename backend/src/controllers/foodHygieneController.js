const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Food Establishments Hygiene Inspections
 * @route GET /api/corporation/health/inspections
 */
const getFoodInspections = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT fi.*, w.ward_name
       FROM food_inspections fi
       LEFT JOIN wards w ON fi.ward_id = w.ward_id
       WHERE fi.corporation_id = ?
       ORDER BY fi.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Food hygiene inspections fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch food inspections', error.message, 500);
  }
};

/**
 * @desc Conduct Food Hygiene Inspection (FINSP-2026-XXXXXX)
 * @route POST /api/corporation/health/inspections
 */
const createFoodInspection = async (req, res) => {
  try {
    const { establishment_name = 'Rajesh Sweets & Restaurant Ward 24', ward_id = 'w-demo-024', hygiene_score = 88, result = 'COMPLIANT' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const finspNum = `FINSP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finspId = `finsp-${Date.now()}`;

    await pool.query(
      `INSERT INTO food_inspections (inspection_id, inspection_number, corporation_id, ward_id, establishment_name, hygiene_score, result, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED')`,
      [finspId, finspNum, corpId, ward_id, establishment_name, parseInt(hygiene_score), result]
    );

    return sendSuccess(res, 'Food hygiene inspection logged', { inspection_id: finspId, inspection_number: finspNum }, 201);
  } catch (error) {
    return sendError(res, 'Inspection logging failed', error.message, 500);
  }
};

module.exports = {
  getFoodInspections,
  createFoodInspection
};
