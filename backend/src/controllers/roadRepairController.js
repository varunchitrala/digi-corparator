const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Road Repairs Register
 * @route GET /api/corporation/roads/repairs
 */
const getRepairs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT rep.*, r.road_name
       FROM road_repairs rep
       JOIN roads r ON rep.road_id = r.road_id
       ORDER BY rep.created_at DESC`
    );
    return sendSuccess(res, 'Road repairs register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch repairs', error.message, 500);
  }
};

/**
 * @desc Create Road Repair & Link Work Order (RREP-2026-XXXXXX)
 * @route POST /api/corporation/roads/repairs
 */
const createRepair = async (req, res) => {
  try {
    const { road_id = 'road-001', pothole_id = 'pot-001', work_order_id = 'WO-2026-314274', repair_type = 'POTHOLE_REPAIR' } = req.body;

    const repNum = `RREP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const repId = `rrep-${Date.now()}`;

    await pool.query(
      `INSERT INTO road_repairs (repair_id, repair_number, road_id, pothole_id, work_order_id, repair_type, progress_percentage, status)
       VALUES (?, ?, ?, ?, ?, ?, 10, 'IN_PROGRESS')`,
      [repId, repNum, road_id, pothole_id, work_order_id, repair_type]
    );

    if (pothole_id) {
      await pool.query(`UPDATE road_potholes SET status = 'WORK_ASSIGNED' WHERE pothole_id = ?`, [pothole_id]);
    }

    return sendSuccess(res, 'Road repair work order linked successfully', { repair_id: repId, repair_number: repNum }, 201);
  } catch (error) {
    return sendError(res, 'Road repair creation failed', error.message, 500);
  }
};

module.exports = {
  getRepairs,
  createRepair
};
