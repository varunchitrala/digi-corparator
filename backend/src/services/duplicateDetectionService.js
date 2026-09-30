const { pool } = require('../config/db');

/**
 * Rule-based Duplicate Detection Service
 * Checks for complaints in same ward, category, and nearby latitude/longitude within 48 hours
 */
const detectDuplicates = async ({ ward_id, category_id, latitude, longitude }) => {
  try {
    if (!latitude || !longitude) return [];

    const [rows] = await pool.query(
      `SELECT complaint_id, complaint_number, title, status, created_at,
              (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance_km
       FROM complaints
       WHERE ward_id = ?
         AND category_id = ?
         AND status NOT IN ('CLOSED', 'REJECTED', 'CANCELLED')
         AND created_at >= DATE_SUB(NOW(), INTERVAL 48 HOUR)
       HAVING distance_km < 0.2
       ORDER BY distance_km ASC LIMIT 5`,
      [latitude, longitude, latitude, ward_id, category_id]
    );

    return rows;
  } catch (err) {
    console.error('[Duplicate Detection Error]', err.message);
    return [];
  }
};

module.exports = {
  detectDuplicates
};
