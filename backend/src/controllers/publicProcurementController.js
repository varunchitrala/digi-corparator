const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Public Tenders Portal & Awarded Contracts
 * @route GET /api/public/tenders
 */
const getPublicTenders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.tender_id, t.tender_number, t.title, t.description, t.tender_type, t.estimated_value, t.submission_end, t.status,
              COALESCE(d.department_name, 'Municipal Works Department') AS department_name,
              COALESCE(corp.corporation_name, 'Chhatrapati Sambhajinagar Municipal Corporation') AS corporation_name
       FROM tenders t
       LEFT JOIN departments d ON t.department_id = d.department_id
       LEFT JOIN corporations corp ON t.corporation_id = corp.corporation_id
       WHERE t.status IN ('PUBLISHED', 'OPEN', 'CLOSING_SOON', 'UNDER_FINANCIAL_EVALUATION', 'AWARDED')
       ORDER BY t.created_at DESC`
    );
    return sendSuccess(res, 'Public tenders portal data retrieved', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch public tenders', error.message, 500);
  }
};

module.exports = {
  getPublicTenders
};
