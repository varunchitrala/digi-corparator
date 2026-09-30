const { pool } = require('../config/db');

/**
 * Sealed Financial Bid Opening & L1 Lowest Responsive Bidder Calculation Engine
 */
const calculateL1Bidder = async (tenderId) => {
  try {
    const [bids] = await pool.query(
      `SELECT b.bid_id, b.vendor_id, b.quoted_amount, te.result AS tech_result
       FROM bids b
       LEFT JOIN technical_evaluations te ON b.bid_id = te.bid_id
       WHERE b.tender_id = ? AND (te.result = 'QUALIFIED' OR b.technical_status = 'QUALIFIED')
       ORDER BY b.quoted_amount ASC`,
      [tenderId]
    );

    if (bids.length === 0) return null;

    // Lowest bidder is L1
    const l1Bid = bids[0];

    // Update statuses: L1 for lowest, L2/L3 for rest
    for (let i = 0; i < bids.length; i++) {
      const rankStatus = i === 0 ? 'L1' : (i === 1 ? 'L2' : 'L3');
      await pool.query(
        `UPDATE bids SET financial_status = ? WHERE bid_id = ?`,
        [rankStatus, bids[i].bid_id]
      );
    }

    return l1Bid;
  } catch (err) {
    console.error('[L1 Calculation Error]', err);
    return null;
  }
};

module.exports = {
  calculateL1Bidder
};
