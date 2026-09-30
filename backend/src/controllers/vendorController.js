const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Vendors Register
 * @route GET /api/corporation/procurement/vendors
 */
const getVendors = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(`SELECT * FROM vendors WHERE corporation_id = ? ORDER BY created_at DESC`, [corpId]);
    return sendSuccess(res, 'Vendors directory fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch vendors', error.message, 500);
  }
};

/**
 * @desc Register New Vendor (VEN-2026-XXXXXX)
 * @route POST /api/corporation/procurement/vendors
 */
const registerVendor = async (req, res) => {
  try {
    const { vendor_name = 'Apex Infrastructure Ltd', legal_name = 'Apex Infrastructure Pvt Ltd', pan = 'ABCDE1234F', gstin = '27ABCDE1234F1Z5', mobile = '9822088776', email = 'contact@apexinfra.com', address = 'Industrial Estate Ward 24' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const venNum = `VEN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const venId = `ven-${Date.now()}`;

    await pool.query(
      `INSERT INTO vendors (vendor_id, vendor_code, corporation_id, vendor_name, legal_name, pan, gstin, address, contact_person, mobile, email, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Contact Person', ?, ?, 'ACTIVE')`,
      [venId, venNum, corpId, vendor_name, legal_name, pan, gstin, address, mobile, email]
    );

    return sendSuccess(res, 'Vendor registered successfully', { vendor_id: venId, vendor_code: venNum }, 201);
  } catch (error) {
    return sendError(res, 'Vendor registration failed', error.message, 500);
  }
};

/**
 * @desc Blacklist Vendor (Blacklisted Vendor Guard)
 * @route POST /api/corporation/procurement/vendors/:id/blacklist
 */
const blacklistVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Failure to fulfill contract terms' } = req.body;

    await pool.query(`UPDATE vendors SET status = 'BLACKLISTED', blacklisted = TRUE, blacklist_reason = ? WHERE vendor_id = ?`, [reason, id]);
    return sendSuccess(res, 'Vendor blacklisted successfully');
  } catch (error) {
    return sendError(res, 'Failed to blacklist vendor', error.message, 500);
  }
};

module.exports = {
  getVendors,
  registerVendor,
  blacklistVendor
};
