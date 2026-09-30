const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Parking Lots & Traffic Challans
 * @route GET /api/corporation/parking/lots
 */
const getParkingData = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [lots] = await pool.query(
      `SELECT pl.*, w.ward_name
       FROM parking_lots pl
       LEFT JOIN wards w ON pl.ward_id = w.ward_id
       WHERE pl.corporation_id = ?
       ORDER BY pl.created_at DESC`,
      [corpId]
    );

    const [challans] = await pool.query(
      `SELECT tc.*
       FROM traffic_challans tc
       WHERE tc.corporation_id = ?
       ORDER BY tc.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Parking & Traffic data fetched', { lots, challans });
  } catch (error) {
    return sendError(res, 'Failed to fetch parking data', error.message, 500);
  }
};

/**
 * @desc Register Smart Parking Lot (PRK-2026-XXXXXX)
 * @route POST /api/corporation/parking/lots
 */
const createParkingLot = async (req, res) => {
  try {
    const { lot_name = 'Ward 24 Station Road Multi-Level Parking', ward_id = 'w-demo-024', total_capacity = 150, hourly_rate = 20 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const lotNum = `PRK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const lotId = `prk-${Date.now()}`;

    await pool.query(
      `INSERT INTO parking_lots (lot_id, lot_code, corporation_id, ward_id, lot_name, total_capacity, occupied_slots, hourly_rate)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [lotId, lotNum, corpId, ward_id, lot_name, parseInt(total_capacity), parseFloat(hourly_rate)]
    );

    return sendSuccess(res, 'Parking lot registered', { lot_id: lotId, lot_code: lotNum }, 201);
  } catch (error) {
    return sendError(res, 'Parking lot registration failed', error.message, 500);
  }
};

module.exports = {
  getParkingData,
  createParkingLot
};
