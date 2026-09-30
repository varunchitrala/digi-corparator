const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get All Corporation Complaints Directory
 * @route GET /api/corporation/complaints
 */
const getCorpAdminComplaints = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [rows] = await pool.query(
      `SELECT cmp.*, cc.category_name, d.department_name, w.ward_name, u.first_name AS officer_first_name, u.last_name AS officer_last_name
       FROM complaints cmp
       LEFT JOIN complaint_categories cc ON cmp.category_id = cc.category_id
       LEFT JOIN departments d ON cmp.department_id = d.department_id
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       LEFT JOIN users u ON cmp.assigned_officer_id = u.user_id
       WHERE cmp.corporation_id = ? AND cmp.deleted_at IS NULL
       ORDER BY cmp.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Corporation complaints directory fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch corporation complaints', error.message, 500);
  }
};

/**
 * @desc Get Grievance Analytics & SLA Telemetry
 * @route GET /api/corporation/complaints/analytics
 */
const getComplaintAnalytics = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [totalRows] = await pool.query(`SELECT COUNT(*) AS total FROM complaints WHERE corporation_id = ?`, [corpId]);
    const [resolvedRows] = await pool.query(`SELECT COUNT(*) AS resolved FROM complaints WHERE corporation_id = ? AND status IN ('RESOLVED', 'CLOSED')`, [corpId]);
    const [escalatedRows] = await pool.query(`SELECT COUNT(*) AS escalated FROM complaints WHERE corporation_id = ? AND status = 'ESCALATED'`, [corpId]);
    const [reopenedRows] = await pool.query(`SELECT COUNT(*) AS reopened FROM complaints WHERE corporation_id = ? AND status = 'REOPENED'`, [corpId]);

    const [feedbackRows] = await pool.query(
      `SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM complaint_feedback f JOIN complaints c ON f.complaint_id = c.complaint_id WHERE c.corporation_id = ?`,
      [corpId]
    );

    const [categoryGroup] = await pool.query(
      `SELECT cc.category_name, COUNT(*) as count FROM complaints c JOIN complaint_categories cc ON c.category_id = cc.category_id WHERE c.corporation_id = ? GROUP BY cc.category_name`,
      [corpId]
    );

    const total = totalRows[0]?.total || 0;
    const resolved = resolvedRows[0]?.resolved || 0;
    const slaComplianceRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    return sendSuccess(res, 'Complaint analytics telemetry fetched', {
      total_complaints: total,
      resolved_complaints: resolved,
      escalated_complaints: escalatedRows[0]?.escalated || 0,
      reopened_complaints: reopenedRows[0]?.reopened || 0,
      sla_compliance_rate: slaComplianceRate,
      average_satisfaction_rating: parseFloat(feedbackRows[0]?.avg_rating || 4.5).toFixed(1),
      category_breakdown: categoryGroup
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch complaint analytics', error.message, 500);
  }
};

/**
 * @desc Get Corporation Complaints Leaflet Map Pins
 * @route GET /api/corporation/complaints/map
 */
const getCorpComplaintMap = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [rows] = await pool.query(
      `SELECT cmp.complaint_id, cmp.complaint_number, cmp.title, cmp.latitude, cmp.longitude, cmp.status, cmp.priority, w.ward_name
       FROM complaints cmp
       LEFT JOIN wards w ON cmp.ward_id = w.ward_id
       WHERE cmp.corporation_id = ? AND cmp.latitude IS NOT NULL AND cmp.longitude IS NOT NULL`,
      [corpId]
    );

    return sendSuccess(res, 'Corporation complaint map pins fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch map pins', error.message, 500);
  }
};

module.exports = {
  getCorpAdminComplaints,
  getComplaintAnalytics,
  getCorpComplaintMap
};
