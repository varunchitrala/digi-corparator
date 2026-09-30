const { pool } = require('../config/db');

/**
 * Certificate Generator & Verification Helper
 */
const generateCertificateNumber = () => {
  return `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
};

const getPublicCertificateDetails = async (certificateNumber) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.certificate_number, c.service_name, c.issue_date, c.status, corp.corporation_name
       FROM application_certificates c
       JOIN corporations corp ON c.corporation_id = corp.corporation_id
       WHERE c.certificate_number = ?`,
      [certificateNumber]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    console.error('[Get Public Certificate Error]', err);
    return null;
  }
};

module.exports = {
  generateCertificateNumber,
  getPublicCertificateDetails
};
