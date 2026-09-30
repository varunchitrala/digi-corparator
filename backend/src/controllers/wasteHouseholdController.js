const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Household Master Directory
 * @route GET /api/corporation/waste/households
 */
const getHouseholds = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT h.*, w.ward_name
       FROM waste_households h
       LEFT JOIN wards w ON h.ward_id = w.ward_id
       WHERE h.corporation_id = ?
       ORDER BY h.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Household waste register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch households', error.message, 500);
  }
};

/**
 * @desc Register New Waste Household (HH-2026-XXXXXX)
 * @route POST /api/corporation/waste/households
 */
const createHousehold = async (req, res) => {
  try {
    const { owner_name = 'Ramesh Patil', ward_id = 'w-demo-024', address = 'Plot 45 Civil Lines Ward 24', waste_category = 'WET' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const hhNum = `HH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const hhId = `hh-${Date.now()}`;

    await pool.query(
      `INSERT INTO waste_households (household_id, household_number, corporation_id, ward_id, owner_name, address, waste_category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [hhId, hhNum, corpId, ward_id, owner_name, address, waste_category]
    );

    return sendSuccess(res, 'Household waste profile registered successfully', { household_id: hhId, household_number: hhNum }, 201);
  } catch (error) {
    return sendError(res, 'Household registration failed', error.message, 500);
  }
};

module.exports = {
  getHouseholds,
  createHousehold
};
