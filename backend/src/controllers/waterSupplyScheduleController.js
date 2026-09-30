const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Water Supply Schedules
 * @route GET /api/corporation/water/schedules
 */
const getSchedules = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT s.*, w.ward_name
       FROM water_supply_schedules s
       LEFT JOIN wards w ON s.ward_id = w.ward_id
       WHERE s.corporation_id = ?
       ORDER BY s.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Water supply schedules fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch schedules', error.message, 500);
  }
};

/**
 * @desc Create Water Supply Schedule
 * @route POST /api/corporation/water/schedules
 */
const createSchedule = async (req, res) => {
  try {
    const { zone_name = 'Ward 24 Zone A Civil Lines', ward_id = 'w-demo-024', supply_date = '2026-08-28', start_time = '06:00:00', end_time = '09:00:00' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const schId = `sch-${Date.now()}`;

    await pool.query(
      `INSERT INTO water_supply_schedules (schedule_id, corporation_id, ward_id, zone_name, supply_date, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')`,
      [schId, corpId, ward_id, zone_name, supply_date, start_time, end_time]
    );

    return sendSuccess(res, 'Water supply schedule published', { schedule_id: schId }, 201);
  } catch (error) {
    return sendError(res, 'Schedule creation failed', error.message, 500);
  }
};

/**
 * @desc Public Ward Water Supply Schedule
 * @route GET /api/public/water/schedule
 */
const getPublicSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.zone_name, s.supply_date, s.start_time, s.end_time, s.status, w.ward_name
       FROM water_supply_schedules s
       LEFT JOIN wards w ON s.ward_id = w.ward_id
       ORDER BY s.supply_date DESC, s.start_time ASC`
    );
    return sendSuccess(res, 'Public water supply schedules fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch public supply schedules', error.message, 500);
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  getPublicSchedule
};
