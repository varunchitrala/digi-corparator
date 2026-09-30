const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateL1Bidder } = require('../services/bidEvaluationService');

/**
 * @desc Record Technical Evaluation for Bid
 * @route POST /api/corporation/procurement/tenders/:id/technical-evaluation
 */
const recordTechnicalEvaluation = async (req, res) => {
  try {
    const { bid_id, score = 90, result = 'QUALIFIED', remarks = 'Technical criteria met' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    await pool.query(
      `INSERT INTO technical_evaluations (evaluation_id, bid_id, evaluator_id, score, result, remarks)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score), result = VALUES(result), remarks = VALUES(remarks)`,
      [`teval-${Date.now()}`, bid_id, userId, parseInt(score, 10), result, remarks]
    );

    await pool.query(`UPDATE bids SET technical_status = ? WHERE bid_id = ?`, [result, bid_id]);

    return sendSuccess(res, 'Technical evaluation recorded', { bid_id, result });
  } catch (error) {
    return sendError(res, 'Technical evaluation failed', error.message, 500);
  }
};

/**
 * @desc Open Sealed Financial Bids & Calculate L1 Lowest Responsive Bidder
 * @route POST /api/corporation/procurement/tenders/:id/financial-opening
 */
const openFinancialBids = async (req, res) => {
  try {
    const { id } = req.params; // tender_id

    const l1Bid = await calculateL1Bidder(id);
    if (!l1Bid) {
      return sendError(res, 'No qualified technical bids found for financial opening', [], 400);
    }

    await pool.query(`UPDATE tenders SET status = 'UNDER_FINANCIAL_EVALUATION' WHERE tender_id = ?`, [id]);

    return sendSuccess(res, 'Financial bids opened & L1 calculated successfully', {
      tender_id: id,
      l1_vendor_id: l1Bid.vendor_id,
      l1_quoted_amount: l1Bid.quoted_amount
    });
  } catch (error) {
    return sendError(res, 'Financial bid opening failed', error.message, 500);
  }
};

module.exports = {
  recordTechnicalEvaluation,
  openFinancialBids
};
