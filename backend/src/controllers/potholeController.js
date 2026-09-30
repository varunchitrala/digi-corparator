const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculatePotholeVolume } = require('../services/potholeStatusService');

/**
 * @desc Get Potholes Register
 * @route GET /api/corporation/roads/potholes
 */
const getPotholes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, r.road_name, w.ward_name
       FROM road_potholes p
       JOIN roads r ON p.road_id = r.road_id
       LEFT JOIN wards w ON p.ward_id = w.ward_id
       ORDER BY p.created_at DESC`
    );
    return sendSuccess(res, 'Potholes register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch potholes', error.message, 500);
  }
};

/**
 * @desc Log Pothole & Calculate Volume (POT-2026-XXXXXX)
 * @route POST /api/corporation/roads/potholes
 */
const createPothole = async (req, res) => {
  try {
    const { road_id = 'road-001', ward_id = 'w-demo-024', length_meters = 1.5, width_meters = 1.0, depth_meters = 0.15, severity = 'MEDIUM' } = req.body;

    const volVal = calculatePotholeVolume(length_meters, width_meters, depth_meters);
    if (!volVal.valid) {
      return sendError(res, volVal.reason, [], 400);
    }

    const potNum = `POT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const potId = `pot-${Date.now()}`;

    await pool.query(
      `INSERT INTO road_potholes (pothole_id, pothole_number, road_id, ward_id, length_meters, width_meters, depth_meters, estimated_volume_m3, severity, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'REPORTED')`,
      [potId, potNum, road_id, ward_id, volVal.length, volVal.width, volVal.depth, volVal.estimatedVolumeM3, severity]
    );

    return sendSuccess(res, 'Pothole logged & estimated volume calculated', {
      pothole_id: potId,
      pothole_number: potNum,
      area_m2: volVal.areaM2,
      estimated_volume_m3: volVal.estimatedVolumeM3
    }, 201);
  } catch (error) {
    return sendError(res, 'Pothole logging failed', error.message, 500);
  }
};

module.exports = {
  getPotholes,
  createPothole
};
