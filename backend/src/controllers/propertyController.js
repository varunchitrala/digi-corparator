const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Properties Register
 * @route GET /api/corporation/revenue/properties
 */
const getProperties = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT p.*, w.ward_name
       FROM properties p
       LEFT JOIN wards w ON p.ward_id = w.ward_id
       WHERE p.corporation_id = ?
       ORDER BY p.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Properties master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch properties', error.message, 500);
  }
};

/**
 * @desc Register New Municipal Property (PROP-2026-XXXXXX)
 * @route POST /api/corporation/revenue/properties
 */
const createProperty = async (req, res) => {
  try {
    const { owner_name = 'Ramesh Patil', mobile = '9822011445', ward_id = 'w-demo-024', property_type = 'RESIDENTIAL', usage_type = 'Residential Flat', built_up_area = 1000, address = 'Plot 45 Civil Lines Ward 24' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const propNum = `PROP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const propId = `prop-${Date.now()}`;

    await pool.query(
      `INSERT INTO properties (property_id, property_number, corporation_id, ward_id, owner_name, mobile, property_type, usage_type, built_up_area, address, status, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)`,
      [propId, propNum, corpId, ward_id, owner_name, mobile, property_type, usage_type, parseFloat(built_up_area), address, userId]
    );

    return sendSuccess(res, 'Municipal property registered successfully', { property_id: propId, property_number: propNum }, 201);
  } catch (error) {
    return sendError(res, 'Property registration failed', error.message, 500);
  }
};

module.exports = {
  getProperties,
  createProperty
};
