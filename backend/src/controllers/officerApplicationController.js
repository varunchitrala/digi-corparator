const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateApplicationStatusTransition } = require('../services/applicationStatusTransitionService');
const { generateCertificateNumber } = require('../services/certificateGenerationService');

/**
 * @desc Get Officer Applications List
 * @route GET /api/officer/applications
 */
const getOfficerApplications = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT a.*, s.service_name, u.full_name AS citizen_name
       FROM applications a
       JOIN service_types s ON a.service_id = s.service_id
       LEFT JOIN users u ON a.citizen_id = u.user_id
       WHERE a.corporation_id = ?
       ORDER BY a.submitted_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Officer applications retrieved', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch officer applications', error.message, 500);
  }
};

/**
 * @desc Verify / Reject Application Document
 * @route POST /api/officer/applications/:id/verify-document
 */
const verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { app_doc_id, status = 'VERIFIED', remarks = 'Document verified' } = req.body;

    await pool.query(
      `UPDATE application_documents SET verification_status = ?, remarks = ? WHERE app_doc_id = ? AND application_id = ?`,
      [status, remarks, app_doc_id, id]
    );

    return sendSuccess(res, `Document verification updated to ${status}`);
  } catch (error) {
    return sendError(res, 'Document verification failed', error.message, 500);
  }
};

/**
 * @desc Request Clarification from Citizen (Status -> CLARIFICATION_REQUIRED)
 * @route POST /api/officer/applications/:id/clarification
 */
const requestClarification = async (req, res) => {
  try {
    const { id } = req.params;
    const { question = 'Please upload a clearer copy of address proof.' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-officer-001';

    await pool.query(
      `INSERT INTO application_clarifications (clarification_id, application_id, clarification_question, requested_by_id)
       VALUES (?, ?, ?, ?)`,
      [`clar-${Date.now()}`, id, question, userId]
    );

    await pool.query(`UPDATE applications SET status = 'CLARIFICATION_REQUIRED' WHERE application_id = ?`, [id]);

    await pool.query(
      `INSERT INTO application_history (history_id, application_id, old_status, new_status, action, remarks, performed_by_id)
       VALUES (?, ?, 'DOCUMENT_VERIFICATION', 'CLARIFICATION_REQUIRED', 'CLARIFICATION_REQUESTED', ?, ?)`,
      [`hist-${Date.now()}`, id, question, userId]
    );

    return sendSuccess(res, 'Clarification requested from citizen successfully');
  } catch (error) {
    return sendError(res, 'Failed to request clarification', error.message, 500);
  }
};

/**
 * @desc Record Field Inspection with GPS Coordinates
 * @route POST /api/officer/applications/:id/inspection
 */
const recordInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude = 19.8762, longitude = 75.3433, findings = 'Site verified in person. Parameters within municipal code.', result = 'PASS' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-officer-001';

    await pool.query(
      `INSERT INTO application_inspections (inspection_id, application_id, inspector_id, inspection_date, latitude, longitude, findings, result)
       VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)`,
      [`insp-${Date.now()}`, id, userId, latitude, longitude, findings, result]
    );

    await pool.query(`UPDATE applications SET status = 'APPROVAL_PENDING' WHERE application_id = ?`, [id]);

    return sendSuccess(res, 'Field inspection recorded successfully', { result });
  } catch (error) {
    return sendError(res, 'Failed to record field inspection', error.message, 500);
  }
};

/**
 * @desc Approve Application & Generate Official Certificate (CERT-2026-XXXXXX)
 * @route POST /api/officer/applications/:id/approve
 */
const approveApplication = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const userId = req.user ? req.user.user_id : 'u-officer-001';

    const [apps] = await connection.query(`SELECT a.*, s.service_name FROM applications a JOIN service_types s ON a.service_id = s.service_id WHERE a.application_id = ?`, [id]);
    if (apps.length === 0) {
      await connection.rollback();
      return sendError(res, 'Application not found', [], 404);
    }
    const app = apps[0];

    const certNum = generateCertificateNumber();
    const certId = `cert-${Date.now()}`;

    await connection.query(
      `INSERT INTO application_certificates (certificate_id, certificate_number, application_id, corporation_id, service_name, issue_date, file_url, status)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?, 'VALID')`,
      [certId, certNum, id, app.corporation_id, app.service_name, `https://nagarsevak.gov.in/certificates/${certNum}.pdf`]
    );

    await connection.query(`UPDATE applications SET status = 'APPROVED', approved_at = CURRENT_TIMESTAMP WHERE application_id = ?`, [id]);

    await connection.query(
      `INSERT INTO application_history (history_id, application_id, old_status, new_status, action, remarks, performed_by_id)
       VALUES (?, ?, 'APPROVAL_PENDING', 'APPROVED', 'APPLICATION_APPROVED', 'Approved by officer. Certificate issued.', ?)`,
      [`hist-${Date.now()}`, id, userId]
    );

    await connection.commit();

    return sendSuccess(res, 'Application approved and certificate generated', { certificate_number: certNum }, 200);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Application approval failed', error.message, 500);
  } finally {
    connection.release();
  }
};

module.exports = {
  getOfficerApplications,
  verifyDocument,
  requestClarification,
  recordInspection,
  approveApplication
};
