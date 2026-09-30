const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Apply for Tax Clearance Certificate (TCC-2026-XXXXXX) with Zero Outstanding Guard
 * @route POST /api/citizen/revenue/clearance/generate
 */
const generateTaxClearance = async (req, res) => {
  try {
    const { property_id = 'prop-001' } = req.body;

    // Check Property Outstanding Balance
    const [bills] = await pool.query(
      `SELECT SUM(outstanding_amount) AS total_due FROM bills WHERE property_id = ? AND status != 'PAID'`,
      [property_id]
    );

    const totalDue = parseFloat(bills[0]?.total_due || 0);
    if (totalDue > 0) {
      return sendError(res, `Unpaid Tax Clearance Guard: Tax clearance certificate blocked due to outstanding balance of ₹${totalDue.toLocaleString('en-IN')}. Please pay all pending dues first.`, [], 400);
    }

    const [props] = await pool.query(`SELECT owner_name FROM properties WHERE property_id = ?`, [property_id]);
    const ownerName = props.length > 0 ? props[0].owner_name : 'Property Owner';

    const tccNum = `TCC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const tccId = `tcc-${Date.now()}`;

    const issueDate = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    await pool.query(
      `INSERT INTO tax_clearance_certificates (certificate_id, certificate_number, property_id, owner_name, issue_date, valid_until, status)
       VALUES (?, ?, ?, ?, ?, ?, 'VALID')`,
      [tccId, tccNum, property_id, ownerName, issueDate, validUntil]
    );

    return sendSuccess(res, 'Tax clearance certificate generated successfully', {
      certificate_id: tccId,
      certificate_number: tccNum,
      issue_date: issueDate,
      valid_until: validUntil
    }, 201);
  } catch (error) {
    return sendError(res, 'Tax clearance generation failed', error.message, 500);
  }
};

/**
 * @desc Public QR Tax Clearance Certificate Verification
 * @route GET /api/public/clearance/:certificateNumber
 */
const getPublicTaxClearance = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const [rows] = await pool.query(
      `SELECT tcc.certificate_number, tcc.owner_name, tcc.issue_date, tcc.valid_until, tcc.status, p.property_number, p.address
       FROM tax_clearance_certificates tcc
       JOIN properties p ON tcc.property_id = p.property_id
       WHERE tcc.certificate_number = ?`,
      [certificateNumber]
    );

    if (rows.length === 0) return sendError(res, 'Tax clearance certificate not found', [], 404);
    return sendSuccess(res, 'Tax clearance certificate verified', rows[0]);
  } catch (error) {
    return sendError(res, 'Failed to verify tax clearance certificate', error.message, 500);
  }
};

module.exports = {
  generateTaxClearance,
  getPublicTaxClearance
};
