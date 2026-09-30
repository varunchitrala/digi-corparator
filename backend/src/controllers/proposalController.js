const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getProposals = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM proposals ORDER BY created_at DESC`);
    return sendSuccess(res, 'Proposals retrieved', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch proposals', error.message, 500);
  }
};

const createProposal = async (req, res) => {
  try {
    const { title, description, estimated_budget } = req.body;
    const proposalId = `p-${Date.now()}`;
    const proposalCode = `PROP-2026-${Math.floor(10 + Math.random() * 90)}`;
    const userId = req.user ? req.user.user_id || 'u-corp-024' : 'u-corp-024';

    await pool.query(
      `INSERT INTO proposals (proposal_id, proposal_code, corporation_id, ward_id, submitted_by_id, title, description, estimated_budget, status)
       VALUES (?, ?, 'c-demo-001', 'w-demo-024', ?, ?, ?, ?, 'SUBMITTED')`,
      [proposalId, proposalCode, userId, title, description, estimated_budget]
    );

    return sendSuccess(res, 'Proposal submitted successfully', { proposal_id: proposalId, proposal_code: proposalCode }, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit proposal', error.message, 500);
  }
};

module.exports = {
  getProposals,
  createProposal
};
