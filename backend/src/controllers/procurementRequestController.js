const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Procurement Requests
 * @route GET /api/corporation/procurement/requests
 */
const getProcurementRequests = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT pr.*, d.department_name
       FROM procurement_requests pr
       LEFT JOIN departments d ON pr.department_id = d.department_id
       WHERE pr.corporation_id = ?
       ORDER BY pr.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Procurement requests fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch procurement requests', error.message, 500);
  }
};

/**
 * @desc Create New Procurement Request (PR-2026-XXXXXX)
 * @route POST /api/corporation/procurement/requests
 */
const createProcurementRequest = async (req, res) => {
  try {
    const { title = 'Road Concreting Work Ward 24', department_id = 'dept-001', ward_id = 'w-demo-024', estimated_cost = 1200000, description = 'Road concreting requirement' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-dept-001';

    const prNum = `PR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const prId = `pr-${Date.now()}`;

    await pool.query(
      `INSERT INTO procurement_requests (request_id, request_number, corporation_id, department_id, ward_id, title, description, estimated_cost, requested_by_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')`,
      [prId, prNum, corpId, department_id, ward_id, title, description, parseFloat(estimated_cost), userId]
    );

    return sendSuccess(res, 'Procurement request submitted successfully', { request_id: prId, request_number: prNum }, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit procurement request', error.message, 500);
  }
};

module.exports = {
  getProcurementRequests,
  createProcurementRequest
};
