const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Tenders Master List
 * @route GET /api/corporation/procurement/tenders
 */
const getTenders = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT t.*, d.department_name
       FROM tenders t
       LEFT JOIN departments d ON t.department_id = d.department_id
       WHERE t.corporation_id = ?
       ORDER BY t.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Tenders list fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch tenders', error.message, 500);
  }
};

/**
 * @desc Publish New Municipal Tender (TNDR-2026-XXXXXX)
 * @route POST /api/corporation/procurement/tenders
 */
const createTender = async (req, res) => {
  try {
    const { title = 'Road Concreting Work Ward 24', department_id = 'dept-001', ward_id = 'w-demo-024', estimated_value = 1200000, emd_amount = 24000, tender_fee = 2000, description = 'Municipal Road Tender' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const tndrNum = `TNDR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const tndrId = `tndr-${Date.now()}`;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await pool.query(
      `INSERT INTO tenders (tender_id, tender_number, corporation_id, department_id, ward_id, title, description, estimated_value, emd_amount, tender_fee, submission_start, submission_end, status, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', ?)`,
      [tndrId, tndrNum, corpId, department_id, ward_id, title, description, parseFloat(estimated_value), parseFloat(emd_amount), parseFloat(tender_fee), startDate, endDate, userId]
    );

    return sendSuccess(res, 'Municipal tender published successfully', { tender_id: tndrId, tender_number: tndrNum }, 201);
  } catch (error) {
    return sendError(res, 'Tender publication failed', error.message, 500);
  }
};

module.exports = {
  getTenders,
  createTender
};
