const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateGeoCoordinates } = require('../services/gisService');
const { calculateAssetHealthScore } = require('../services/assetHealthService');

/**
 * @desc Get Corporation Assets Register
 * @route GET /api/corporation/assets
 */
const getAssets = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT a.*, loc.latitude, loc.longitude, loc.address, cat.category_name
       FROM assets a
       JOIN asset_locations loc ON a.asset_id = loc.asset_id
       JOIN asset_categories cat ON a.category_id = cat.category_id
       WHERE a.corporation_id = ?
       ORDER BY a.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Assets register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch assets', error.message, 500);
  }
};

/**
 * @desc Register New Municipal Asset (AST-2026-XXXXXX)
 * @route POST /api/corporation/assets
 */
const createAsset = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { asset_name = 'Smart LED Pole', category_id = 'acat-001', ward_id = 'w-demo-024', latitude = 19.8762, longitude = 75.3433, address = 'Main Road Ward 24', estimated_value = 25000, condition = 'GOOD' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    // Geo Validation
    const geoVal = validateGeoCoordinates(latitude, longitude);
    if (!geoVal.valid) {
      await connection.rollback();
      return sendError(res, geoVal.reason, [], 400);
    }

    const astNum = `AST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const astId = `ast-${Date.now()}`;
    const health = calculateAssetHealthScore(condition, 0);

    await connection.query(
      `INSERT INTO assets (asset_id, asset_code, asset_name, category_id, corporation_id, ward_id, status, \`condition\`, health_score, estimated_value, current_value, public_visibility, description, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?, TRUE, ?, ?)`,
      [astId, astNum, asset_name, category_id, corpId, ward_id, condition, health, parseFloat(estimated_value), parseFloat(estimated_value), `${asset_name} registered`, userId]
    );

    await connection.query(
      `INSERT INTO asset_locations (location_id, asset_id, latitude, longitude, address)
       VALUES (?, ?, ?, ?, ?)`,
      [`loc-${Date.now()}`, astId, geoVal.latitude, geoVal.longitude, address]
    );

    await connection.commit();

    return sendSuccess(res, 'Municipal asset registered successfully', { asset_id: astId, asset_code: astNum, health_score: health }, 201);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Asset registration failed', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Record Asset Inspection & Update Health Score
 * @route POST /api/corporation/assets/:id/inspection
 */
const recordAssetInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition = 'POOR', findings = 'Routine inspection revealed minor structural damage' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const health = calculateAssetHealthScore(condition, 1);

    await pool.query(
      `INSERT INTO asset_inspections (inspection_id, asset_id, inspector_id, inspection_date, \`condition\`, findings)
       VALUES (?, ?, ?, CURDATE(), ?, ?)`,
      [`insp-${Date.now()}`, id, userId, condition, findings]
    );

    await pool.query(`UPDATE assets SET \`condition\` = ?, health_score = ? WHERE asset_id = ?`, [condition, health, id]);

    return sendSuccess(res, 'Asset inspection recorded', { condition, health_score: health });
  } catch (error) {
    return sendError(res, 'Failed to record asset inspection', error.message, 500);
  }
};

/**
 * @desc Schedule Asset Maintenance (MNT-2026-XXXXXX)
 * @route POST /api/corporation/assets/:id/maintenance
 */
const scheduleMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { maintenance_type = 'CORRECTIVE', description = 'Repair lighting transformer', estimated_cost = 5000 } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const mntNum = `MNT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const mntId = `mnt-${Date.now()}`;

    await pool.query(
      `INSERT INTO asset_maintenance (maintenance_id, maintenance_number, asset_id, maintenance_type, description, estimated_cost, status, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)`,
      [mntId, mntNum, id, maintenance_type, description, parseFloat(estimated_cost), userId]
    );

    await pool.query(`UPDATE assets SET status = 'UNDER_MAINTENANCE' WHERE asset_id = ?`, [id]);

    return sendSuccess(res, 'Asset maintenance scheduled', { maintenance_number: mntNum }, 201);
  } catch (error) {
    return sendError(res, 'Failed to schedule maintenance', error.message, 500);
  }
};

/**
 * @desc Get Public QR Asset Details (Safe Telemetry)
 * @route GET /api/public/assets/:assetCode
 */
const getPublicAssetDetails = async (req, res) => {
  try {
    const { assetCode } = req.params;
    const [rows] = await pool.query(
      `SELECT a.asset_code, a.asset_name, a.status, a.\`condition\`, loc.address, cat.category_name, corp.corporation_name
       FROM assets a
       JOIN asset_locations loc ON a.asset_id = loc.asset_id
       JOIN asset_categories cat ON a.category_id = cat.category_id
       JOIN corporations corp ON a.corporation_id = corp.corporation_id
       WHERE a.asset_code = ? AND a.public_visibility = TRUE`,
      [assetCode]
    );

    if (rows.length === 0) return sendError(res, 'Public asset not found', [], 404);
    return sendSuccess(res, 'Public asset details retrieved', rows[0]);
  } catch (error) {
    return sendError(res, 'Failed to fetch public asset details', error.message, 500);
  }
};

module.exports = {
  getAssets,
  createAsset,
  recordAssetInspection,
  scheduleMaintenance,
  getPublicAssetDetails
};
