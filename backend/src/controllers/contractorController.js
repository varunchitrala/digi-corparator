const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Municipal Contractors Directory
 * @route GET /api/corporation/contractors
 */
const getContractors = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [rows] = await pool.query(
      `SELECT c.*, COUNT(w.work_id) AS total_assigned_works
       FROM contractors c
       LEFT JOIN works w ON c.contractor_id = w.contractor_id
       WHERE c.corporation_id = ?
       GROUP BY c.contractor_id
       ORDER BY c.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Contractors list fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch contractors', error.message, 500);
  }
};

/**
 * @desc Get Contractor Details & Performance Metrics
 * @route GET /api/corporation/contractors/:id
 */
const getContractorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`SELECT * FROM contractors WHERE contractor_id = ?`, [id]);
    if (rows.length === 0) return sendError(res, 'Contractor not found', [], 404);
    const contractor = rows[0];

    const [works] = await pool.query(`SELECT * FROM works WHERE contractor_id = ?`, [id]);

    const totalWorks = works.length;
    const completedWorks = works.filter(w => w.status === 'COMPLETED' || w.status === 'CLOSED').length;
    const delayedWorks = works.filter(w => w.status === 'DELAYED').length;
    const completionRate = totalWorks > 0 ? Math.round((completedWorks / totalWorks) * 100) : 100;

    contractor.performance = {
      total_works: totalWorks,
      completed_works: completedWorks,
      delayed_works: delayedWorks,
      completion_rate: completionRate
    };
    contractor.assigned_works = works;

    return sendSuccess(res, 'Contractor details retrieved', contractor);
  } catch (error) {
    return sendError(res, 'Failed to fetch contractor details', error.message, 500);
  }
};

/**
 * @desc Register New Municipal Contractor
 * @route POST /api/corporation/contractors
 */
const createContractor = async (req, res) => {
  try {
    const { company_name, license_number, contact_person, phone, email } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    if (!company_name || !license_number || !contact_person || !phone || !email) {
      return sendError(res, 'Company name, license number, contact person, phone, and email are required', [], 400);
    }

    const contractorId = `cnt-${Date.now()}`;
    await pool.query(
      `INSERT INTO contractors (contractor_id, corporation_id, company_name, license_number, contact_person, phone, email, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [contractorId, corpId, company_name, license_number, contact_person, phone, email]
    );

    return sendSuccess(res, 'Contractor registered successfully', { contractor_id: contractorId, company_name }, 201);
  } catch (error) {
    return sendError(res, 'Failed to register contractor', error.message, 500);
  }
};

module.exports = {
  getContractors,
  getContractorById,
  createContractor
};
