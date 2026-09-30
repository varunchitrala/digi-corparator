const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Municipal Estate Properties & Encroachments
 * @route GET /api/corporation/estate/properties
 */
const getEstateProperties = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [properties] = await pool.query(
      `SELECT mp.*, w.ward_name
       FROM municipal_properties mp
       LEFT JOIN wards w ON mp.ward_id = w.ward_id
       WHERE mp.corporation_id = ?
       ORDER BY mp.created_at DESC`,
      [corpId]
    );

    const [encroachments] = await pool.query(
      `SELECT e.*, w.ward_name
       FROM encroachments e
       LEFT JOIN wards w ON e.ward_id = w.ward_id
       WHERE e.corporation_id = ?
       ORDER BY e.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Estate properties and encroachments fetched', { properties, encroachments });
  } catch (error) {
    return sendError(res, 'Failed to fetch estate data', error.message, 500);
  }
};

/**
 * @desc Register Municipal Estate Property (EST-2026-XXXXXX)
 * @route POST /api/corporation/estate/properties
 */
const createEstateProperty = async (req, res) => {
  try {
    const { property_name = 'Ward 24 Municipal Shopping Complex', ward_id = 'w-demo-024', land_area_sqft = 15000, lease_status = 'LEASED', monthly_rent = 45000 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const propNum = `EST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const propId = `est-${Date.now()}`;

    await pool.query(
      `INSERT INTO municipal_properties (property_id, property_code, corporation_id, ward_id, property_name, land_area_sqft, lease_status, monthly_rent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [propId, propNum, corpId, ward_id, property_name, land_area_sqft, lease_status, monthly_rent]
    );

    return sendSuccess(res, 'Municipal estate property registered', { property_id: propId, property_code: propNum }, 201);
  } catch (error) {
    return sendError(res, 'Property registration failed', error.message, 500);
  }
};

module.exports = {
  getEstateProperties,
  createEstateProperty
};
