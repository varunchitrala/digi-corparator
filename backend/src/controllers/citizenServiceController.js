const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateApplicationStatusTransition } = require('../services/applicationStatusTransitionService');

/**
 * @desc Get Municipal Service Catalog
 * @route GET /api/citizen/services
 */
const getServicesCatalog = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT s.*, cat.category_name
       FROM service_types s
       JOIN service_categories cat ON s.category_id = cat.category_id
       WHERE s.corporation_id = ? AND s.status = 'ACTIVE' AND s.is_public = TRUE
       ORDER BY cat.category_name, s.service_name`,
      [corpId]
    );
    return sendSuccess(res, 'Service catalog retrieved', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch service catalog', error.message, 500);
  }
};

/**
 * @desc Get Service Details with Dynamic Form Fields & Required Documents
 * @route GET /api/citizen/services/:id
 */
const getServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [services] = await pool.query(`SELECT * FROM service_types WHERE service_id = ?`, [id]);
    if (services.length === 0) return sendError(res, 'Service not found', [], 404);

    const [fields] = await pool.query(`SELECT * FROM service_fields WHERE service_id = ? ORDER BY sequence ASC`, [id]);
    const [documents] = await pool.query(`SELECT * FROM service_documents WHERE service_id = ?`, [id]);

    return sendSuccess(res, 'Service details retrieved', {
      service: services[0],
      fields,
      documents
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch service details', error.message, 500);
  }
};

/**
 * @desc Submit New Citizen Service Application (APP-2026-XXXXXX)
 * @route POST /api/citizen/services/:id/applications
 */
const submitApplication = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { form_data = {}, documents = [], ward_id = 'w-demo-024' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const citizenId = req.user ? req.user.user_id : 'u-citizen-001';

    const [services] = await connection.query(`SELECT * FROM service_types WHERE service_id = ?`, [id]);
    if (services.length === 0) {
      await connection.rollback();
      return sendError(res, 'Service not found', [], 404);
    }
    const service = services[0];

    const appNum = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const appId = `app-${Date.now()}`;

    // SLA Deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (service.processing_days || 7));

    await connection.query(
      `INSERT INTO applications (application_id, application_number, corporation_id, ward_id, citizen_id, service_id, department_id, status, sla_deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?)`,
      [appId, appNum, corpId, ward_id, citizenId, id, service.department_id || null, deadline]
    );

    // Lock Form Data Snapshot
    for (const [key, val] of Object.entries(form_data)) {
      await connection.query(
        `INSERT INTO application_form_data (data_id, application_id, field_name, field_value)
         VALUES (?, ?, ?, ?)`,
        [`fdata-${Date.now()}-${Math.random()}`, appId, key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
      );
    }

    // Attach Documents
    for (const doc of documents) {
      await connection.query(
        `INSERT INTO application_documents (app_doc_id, application_id, document_name, file_url, verification_status)
         VALUES (?, ?, ?, ?, 'PENDING')`,
        [`adoc-${Date.now()}-${Math.random()}`, appId, doc.name || 'Document', doc.url || 'https://via.placeholder.com/150']
      );
    }

    // History Log
    await connection.query(
      `INSERT INTO application_history (history_id, application_id, old_status, new_status, action, remarks, performed_by_id)
       VALUES (?, ?, 'DRAFT', 'SUBMITTED', 'APPLICATION_SUBMITTED', 'Application submitted by citizen', ?)`,
      [`hist-${Date.now()}`, appId, citizenId]
    );

    await connection.commit();

    return sendSuccess(res, 'Application submitted successfully', { application_id: appId, application_number: appNum }, 201);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Application submission failed', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Get Citizen Applications Workspace
 * @route GET /api/citizen/applications
 */
const getCitizenApplications = async (req, res) => {
  try {
    const citizenId = req.user ? req.user.user_id : 'u-citizen-001';
    const [rows] = await pool.query(
      `SELECT a.*, s.service_name, cat.category_name
       FROM applications a
       JOIN service_types s ON a.service_id = s.service_id
       JOIN service_categories cat ON s.category_id = cat.category_id
       WHERE a.citizen_id = ?
       ORDER BY a.submitted_at DESC`,
      [citizenId]
    );
    return sendSuccess(res, 'Citizen applications fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch citizen applications', error.message, 500);
  }
};

/**
 * @desc Get Citizen Application Details with Timeline & Form Data (With IDOR Guard)
 * @route GET /api/citizen/applications/:id
 */
const getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const citizenId = req.user ? req.user.user_id : 'u-citizen-001';

    const [apps] = await pool.query(
      `SELECT a.*, s.service_name, s.fee_required, s.fee_amount
       FROM applications a
       JOIN service_types s ON a.service_id = s.service_id
       WHERE a.application_id = ?`,
      [id]
    );

    if (apps.length === 0) return sendError(res, 'Application not found', [], 404);
    const app = apps[0];

    // IDOR Security Check
    if (req.user && req.user.role === 'CITIZEN' && app.citizen_id !== citizenId) {
      return sendError(res, 'Access denied. You do not own this application.', [], 403);
    }

    const [formData] = await pool.query(`SELECT field_name, field_value FROM application_form_data WHERE application_id = ?`, [id]);
    const [documents] = await pool.query(`SELECT * FROM application_documents WHERE application_id = ?`, [id]);
    const [history] = await pool.query(`SELECT * FROM application_history WHERE application_id = ? ORDER BY created_at ASC`, [id]);
    const [clarifications] = await pool.query(`SELECT * FROM application_clarifications WHERE application_id = ?`, [id]);
    const [inspections] = await pool.query(`SELECT * FROM application_inspections WHERE application_id = ?`, [id]);
    const [certificates] = await pool.query(`SELECT * FROM application_certificates WHERE application_id = ?`, [id]);

    return sendSuccess(res, 'Application details retrieved', {
      application: app,
      form_data: formData,
      documents,
      history,
      clarifications,
      inspections,
      certificate: certificates.length > 0 ? certificates[0] : null
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch application details', error.message, 500);
  }
};

module.exports = {
  getServicesCatalog,
  getServiceDetails,
  submitApplication,
  getCitizenApplications,
  getApplicationDetails
};
