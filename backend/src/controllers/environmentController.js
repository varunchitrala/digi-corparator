const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Municipal Gardens, Tree Census & Tree Cutting Permits
 * @route GET /api/corporation/environment/gardens
 */
const getEnvironmentData = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [gardens] = await pool.query(
      `SELECT g.*, w.ward_name
       FROM municipal_gardens g
       LEFT JOIN wards w ON g.ward_id = w.ward_id
       WHERE g.corporation_id = ?
       ORDER BY g.created_at DESC`,
      [corpId]
    );

    const [trees] = await pool.query(
      `SELECT t.*, w.ward_name
       FROM tree_census t
       LEFT JOIN wards w ON t.ward_id = w.ward_id
       WHERE t.corporation_id = ?
       ORDER BY t.created_at DESC`,
      [corpId]
    );

    const [permits] = await pool.query(
      `SELECT p.*, w.ward_name
       FROM tree_cutting_permits p
       LEFT JOIN wards w ON p.ward_id = w.ward_id
       WHERE p.corporation_id = ?
       ORDER BY p.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Environment data fetched', { gardens, trees, permits, aqi_index: 68 });
  } catch (error) {
    return sendError(res, 'Failed to fetch environment data', error.message, 500);
  }
};

/**
 * @desc Tag Tree Census Item (TREE-2026-XXXXXX)
 * @route POST /api/corporation/environment/trees
 */
const createTreeCensus = async (req, res) => {
  try {
    const { species_name = 'Heritage Banyan Tree', ward_id = 'w-demo-024', girth_cm = 120, health_status = 'HEALTHY' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const treeNum = `TREE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const treeId = `tree-${Date.now()}`;

    await pool.query(
      `INSERT INTO tree_census (tree_id, tree_code, corporation_id, ward_id, species_name, girth_cm, health_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [treeId, treeNum, corpId, ward_id, species_name, parseInt(girth_cm), health_status]
    );

    return sendSuccess(res, 'Tree Census item tagged', { tree_id: treeId, tree_code: treeNum }, 201);
  } catch (error) {
    return sendError(res, 'Tree tagging failed', error.message, 500);
  }
};

module.exports = {
  getEnvironmentData,
  createTreeCensus
};
