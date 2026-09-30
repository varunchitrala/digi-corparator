const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Corporation Admin Services List
 * @route GET /api/corporation/services
 */
const getAdminServices = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT s.*, cat.category_name, COUNT(a.application_id) AS total_applications
       FROM service_types s
       JOIN service_categories cat ON s.category_id = cat.category_id
       LEFT JOIN applications a ON s.service_id = a.service_id
       WHERE s.corporation_id = ?
       GROUP BY s.service_id
       ORDER BY s.service_name`,
      [corpId]
    );
    return sendSuccess(res, 'Admin service management list fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch admin services', error.message, 500);
  }
};

/**
 * @desc Add Field to Dynamic Form Builder
 * @route POST /api/corporation/services/:id/fields
 */
const addDynamicField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field_name, label, type = 'TEXT', required = true, options_json = null } = req.body;

    const fieldId = `field-${Date.now()}`;
    await pool.query(
      `INSERT INTO service_fields (field_id, service_id, field_name, label, type, required, options_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fieldId, id, field_name, label, type, required, options_json ? JSON.stringify(options_json) : null]
    );

    return sendSuccess(res, 'Dynamic field added successfully', { field_id: fieldId }, 201);
  } catch (error) {
    return sendError(res, 'Failed to add dynamic field', error.message, 500);
  }
};

module.exports = {
  getAdminServices,
  addDynamicField
};
