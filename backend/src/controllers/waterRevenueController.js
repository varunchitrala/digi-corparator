const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateWaterBillSlabs } = require('../services/waterBillingService');

/**
 * @desc Get Water Connections
 * @route GET /api/corporation/revenue/water/connections
 */
const getWaterConnections = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT wc.*, p.property_number, p.address
       FROM water_connections wc
       JOIN properties p ON wc.property_id = p.property_id
       WHERE p.corporation_id = ?
       ORDER BY wc.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Water connections fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch water connections', error.message, 500);
  }
};

/**
 * @desc Record Meter Reading & Calculate Water Bill Slabs
 * @route POST /api/corporation/revenue/water/readings
 */
const recordMeterReading = async (req, res) => {
  try {
    const { connection_id = 'wconn-001', current_reading = 125 } = req.body;

    const [conns] = await pool.query(`SELECT * FROM water_connections WHERE connection_id = ?`, [connection_id]);
    if (conns.length === 0) return sendError(res, 'Water connection not found', [], 404);

    const conn = conns[0];
    const prevReading = parseFloat(conn.last_reading || 100);

    const slabVal = calculateWaterBillSlabs(prevReading, current_reading, conn.connection_type);
    if (!slabVal.valid) {
      return sendError(res, slabVal.reason, [], 400);
    }

    const readId = `wread-${Date.now()}`;
    await pool.query(
      `INSERT INTO water_meter_readings (reading_id, connection_id, previous_reading, current_reading, consumption, reading_date)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [readId, connection_id, prevReading, parseFloat(current_reading), slabVal.consumption]
    );

    await pool.query(`UPDATE water_connections SET last_reading = ? WHERE connection_id = ?`, [parseFloat(current_reading), connection_id]);

    return sendSuccess(res, 'Water meter reading recorded & slab bill calculated', {
      consumption: slabVal.consumption,
      slab_bill_amount: slabVal.billAmount,
      total_payable: slabVal.totalPayable
    });
  } catch (error) {
    return sendError(res, 'Failed to record meter reading', error.message, 500);
  }
};

module.exports = {
  getWaterConnections,
  recordMeterReading
};
