const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Corporation GIS Map Layers & Spatial Telemetry
 * @route GET /api/corporation/gis/layers
 */
const getGisLayers = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [layers] = await pool.query(`SELECT * FROM gis_layers WHERE corporation_id = ? AND status = 'ACTIVE'`, [corpId]);

    const [assets] = await pool.query(
      `SELECT a.asset_id, a.asset_code, a.asset_name, a.status, a.condition, a.health_score,
              loc.latitude, loc.longitude, loc.address, cat.category_name
       FROM assets a
       JOIN asset_locations loc ON a.asset_id = loc.asset_id
       JOIN asset_categories cat ON a.category_id = cat.category_id
       WHERE a.corporation_id = ? AND a.status != 'ARCHIVED'`,
      [corpId]
    );

    return sendSuccess(res, 'GIS layers & asset spatial markers retrieved', {
      layers,
      markers: assets.map((a) => ({
        id: a.asset_id,
        code: a.asset_code,
        name: a.asset_name,
        category: a.category_name,
        lat: parseFloat(a.latitude),
        lng: parseFloat(a.longitude),
        address: a.address,
        condition: a.condition,
        health_score: a.health_score,
        status: a.status
      }))
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch GIS spatial data', error.message, 500);
  }
};

module.exports = {
  getGisLayers
};
