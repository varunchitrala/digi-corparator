const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateNetWeight } = require('../services/weighmentService');

/**
 * @desc Get Weighbridge Weighment Records
 * @route GET /api/corporation/waste/weighment
 */
const getWeighments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.*
       FROM waste_weighments w
       ORDER BY w.created_at DESC`
    );
    return sendSuccess(res, 'Weighment records fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch weighments', error.message, 500);
  }
};

/**
 * @desc Record Weighbridge Weighment (WT-2026-XXXXXX)
 * @route POST /api/corporation/waste/weighment
 */
const recordWeighment = async (req, res) => {
  try {
    const { vehicle_id = 'ast-001', gross_weight_kg = 10000, tare_weight_kg = 4000, waste_type = 'MIXED' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const netVal = calculateNetWeight(gross_weight_kg, tare_weight_kg);
    if (!netVal.valid) {
      return sendError(res, netVal.reason, [], 400);
    }

    const wtNum = `WT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const wtId = `wt-${Date.now()}`;

    await pool.query(
      `INSERT INTO waste_weighments (weighment_id, weighment_number, vehicle_id, gross_weight_kg, tare_weight_kg, net_weight_kg, waste_type, weighment_date, operator_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [wtId, wtNum, vehicle_id, netVal.grossWeight, netVal.tareWeight, netVal.netWeight, waste_type, userId]
    );

    return sendSuccess(res, 'Weighbridge weighment recorded successfully', {
      weighment_id: wtId,
      weighment_number: wtNum,
      gross_weight: netVal.grossWeight,
      tare_weight: netVal.tareWeight,
      net_weight: netVal.netWeight
    }, 201);
  } catch (error) {
    return sendError(res, 'Weighment recording failed', error.message, 500);
  }
};

module.exports = {
  getWeighments,
  recordWeighment
};
