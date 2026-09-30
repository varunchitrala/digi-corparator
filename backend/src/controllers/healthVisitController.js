const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateMedicalAccess } = require('../services/healthPrivacyService');

/**
 * @desc Get Individual Patient Medical Visit Records with Privacy Guard
 * @route GET /api/corporation/health/visits
 */
const getVisits = async (req, res) => {
  try {
    const userRole = req.user ? (req.user.role_code || req.user.role) : 'CITIZEN';

    const privacyCheck = validateMedicalAccess(userRole);
    if (!privacyCheck.valid) {
      return sendError(res, privacyCheck.reason, [], 403);
    }

    const [rows] = await pool.query(
      `SELECT hv.*, hf.facility_name, hs.service_name
       FROM health_visits hv
       JOIN health_facilities hf ON hv.facility_id = hf.facility_id
       JOIN health_services hs ON hv.service_id = hs.service_id
       ORDER BY hv.created_at DESC`
    );
    return sendSuccess(res, 'Patient visit records fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch patient visits', error.message, 500);
  }
};

module.exports = {
  getVisits
};
