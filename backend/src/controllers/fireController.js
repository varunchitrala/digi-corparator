const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Fire Stations, NOC Applications & Emergency Incidents
 * @route GET /api/corporation/fire/stations
 */
const getFireStations = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [stations] = await pool.query(
      `SELECT fs.*, w.ward_name
       FROM fire_stations fs
       LEFT JOIN wards w ON fs.ward_id = w.ward_id
       WHERE fs.corporation_id = ?
       ORDER BY fs.created_at DESC`,
      [corpId]
    );

    const [nocs] = await pool.query(
      `SELECT fn.*
       FROM fire_noc_applications fn
       WHERE fn.corporation_id = ?
       ORDER BY fn.created_at DESC`,
      [corpId]
    );

    const [incidents] = await pool.query(
      `SELECT em.*, w.ward_name
       FROM emergency_incidents em
       LEFT JOIN wards w ON em.ward_id = w.ward_id
       WHERE em.corporation_id = ?
       ORDER BY em.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Fire services and emergency data fetched', { stations, nocs, incidents });
  } catch (error) {
    return sendError(res, 'Failed to fetch fire data', error.message, 500);
  }
};

/**
 * @desc Submit Fire NOC Application (FNOC-2026-XXXXXX)
 * @route POST /api/corporation/fire/noc
 */
const createFireNoc = async (req, res) => {
  try {
    const { building_name = 'Shivaji Heights Commercial Complex', risk_category = 'HIGH_RISK' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const fnocNum = `FNOC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const fnocId = `fnoc-${Date.now()}`;

    await pool.query(
      `INSERT INTO fire_noc_applications (fnoc_id, fnoc_number, corporation_id, building_name, risk_category, status)
       VALUES (?, ?, ?, ?, ?, 'APPROVED')`,
      [fnocId, fnocNum, corpId, building_name, risk_category]
    );

    return sendSuccess(res, 'Fire NOC application submitted', { fnoc_id: fnocId, fnoc_number: fnocNum }, 201);
  } catch (error) {
    return sendError(res, 'Fire NOC submission failed', error.message, 500);
  }
};

module.exports = {
  getFireStations,
  createFireNoc
};
