const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Submit Vendor Bid for Tender (BID-2026-XXXXXX) with Blacklist Check
 * @route POST /api/vendor/tenders/:id/bid
 */
const submitBid = async (req, res) => {
  try {
    const { id } = req.params; // tender_id
    const { vendor_id = 'ven-001', quoted_amount = 1150000 } = req.body;

    // Check Vendor Blacklist Status
    const [vendors] = await pool.query(`SELECT status, blacklisted FROM vendors WHERE vendor_id = ?`, [vendor_id]);
    if (vendors.length === 0) return sendError(res, 'Vendor not found', [], 404);
    if (vendors[0].blacklisted || vendors[0].status === 'BLACKLISTED') {
      return sendError(res, 'Blacklisted Vendor Guard: Blacklisted vendors cannot submit bids or receive contract awards.', [], 400);
    }

    const bidNum = `BID-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const bidId = `bid-${Date.now()}`;

    await pool.query(
      `INSERT INTO bids (bid_id, bid_number, tender_id, vendor_id, quoted_amount, technical_status, financial_status, status)
       VALUES (?, ?, ?, ?, ?, 'PENDING', 'SEALED', 'SUBMITTED')`,
      [bidId, bidNum, id, vendor_id, parseFloat(quoted_amount)]
    );

    return sendSuccess(res, 'Bid submitted successfully', { bid_id: bidId, bid_number: bidNum }, 201);
  } catch (error) {
    return sendError(res, 'Bid submission failed', error.message, 500);
  }
};

module.exports = {
  submitBid
};
