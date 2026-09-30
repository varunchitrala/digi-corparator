const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Contracts Master List
 * @route GET /api/corporation/procurement/contracts
 */
const getContracts = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT c.*, v.vendor_name, t.title AS tender_title
       FROM contracts c
       JOIN vendors v ON c.vendor_id = v.vendor_id
       JOIN tenders t ON c.tender_id = t.tender_id
       WHERE c.corporation_id = ?
       ORDER BY c.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Contracts master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch contracts', error.message, 500);
  }
};

/**
 * @desc Create Contract (CON-2026-XXXXXX) & Link to Phase 7 Work Order
 * @route POST /api/corporation/procurement/contracts
 */
const createContract = async (req, res) => {
  try {
    const { tender_id = 'tndr-001', vendor_id = 'ven-001', department_id = 'dept-001', ward_id = 'w-demo-024', contract_value = 1150000, work_order_id = 'wo-001' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const cntNum = `CON-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const cntId = `cnt-${Date.now()}`;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    await pool.query(
      `INSERT INTO contracts (contract_id, contract_number, tender_id, vendor_id, corporation_id, department_id, ward_id, work_order_id, contract_value, start_date, end_date, retention_percentage, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.00, 'ACTIVE')`,
      [cntId, cntNum, tender_id, vendor_id, corpId, department_id, ward_id, work_order_id, parseFloat(contract_value), startDate, endDate]
    );

    await pool.query(`UPDATE tenders SET status = 'AWARDED' WHERE tender_id = ?`, [tender_id]);

    return sendSuccess(res, 'Municipal contract created & Work Order linked successfully', { contract_id: cntId, contract_number: cntNum }, 201);
  } catch (error) {
    return sendError(res, 'Contract creation failed', error.message, 500);
  }
};

module.exports = {
  getContracts,
  createContract
};
