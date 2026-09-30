const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Daily Door-to-Door Collection Records
 * @route GET /api/corporation/waste/collections
 */
const getCollections = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT c.*, h.household_number, h.owner_name, r.route_name
       FROM waste_collections c
       JOIN waste_households h ON c.household_id = h.household_id
       JOIN waste_routes r ON c.route_id = r.route_id
       WHERE h.corporation_id = ?
       ORDER BY c.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Door-to-door collection records fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch collection records', error.message, 500);
  }
};

/**
 * @desc Log Daily Household Collection (COL-2026-XXXXXX)
 * @route POST /api/corporation/waste/collections
 */
const recordCollection = async (req, res) => {
  try {
    const { household_id = 'hh-001', route_id = 'rt-001', waste_type = 'WET', actual_quantity_kg = 2.5 } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const colNum = `COL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const colId = `col-${Date.now()}`;

    await pool.query(
      `INSERT INTO waste_collections (collection_id, collection_number, household_id, route_id, collector_id, collection_date, waste_type, actual_quantity_kg, status)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, 'COLLECTED')`,
      [colId, colNum, household_id, route_id, userId, waste_type, parseFloat(actual_quantity_kg)]
    );

    return sendSuccess(res, 'Door-to-door waste collection logged', { collection_id: colId, collection_number: colNum }, 201);
  } catch (error) {
    return sendError(res, 'Collection logging failed', error.message, 500);
  }
};

module.exports = {
  getCollections,
  recordCollection
};
