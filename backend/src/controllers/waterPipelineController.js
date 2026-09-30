const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateValveOperation } = require('../services/valveAuditService');

/**
 * @desc Get Water Pipelines Register
 * @route GET /api/corporation/water/pipelines
 */
const getPipelines = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT p.*, w.ward_name
       FROM water_pipelines p
       LEFT JOIN wards w ON p.ward_id = w.ward_id
       WHERE p.corporation_id = ?
       ORDER BY p.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Water pipelines master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch pipelines', error.message, 500);
  }
};

/**
 * @desc Create Water Pipeline (PIPE-2026-XXXXXX)
 * @route POST /api/corporation/water/pipelines
 */
const createPipeline = async (req, res) => {
  try {
    const { pipeline_name = 'Ward 24 Main Distribution Pipeline', ward_id = 'w-demo-024', length_meters = 1500 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const pipeNum = `PIPE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const pipeId = `pipe-${Date.now()}`;

    await pool.query(
      `INSERT INTO water_pipelines (pipeline_id, pipeline_code, corporation_id, ward_id, pipeline_name, length_meters, status)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [pipeId, pipeNum, corpId, ward_id, pipeline_name, parseFloat(length_meters)]
    );

    return sendSuccess(res, 'Water pipeline created successfully', { pipeline_id: pipeId, pipeline_code: pipeNum }, 201);
  } catch (error) {
    return sendError(res, 'Pipeline creation failed', error.message, 500);
  }
};

/**
 * @desc Operate Water Valve with Security Guard & Audit Log (water_valve_history)
 * @route POST /api/corporation/water/valves/:id/operate
 */
const operateValve = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params; // valve_id
    const { new_position = 'CLOSED', reason = 'Scheduled Zone Maintenance' } = req.body;
    const userRole = req.user ? (req.user.role_code || req.user.role) : 'CORPORATION_ADMIN';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const opVal = validateValveOperation(userRole, new_position);
    if (!opVal.valid) {
      await connection.rollback();
      return sendError(res, opVal.reason, [], 403);
    }

    const [valves] = await connection.query(`SELECT * FROM water_valves WHERE valve_id = ?`, [id]);
    if (valves.length === 0) {
      await connection.rollback();
      return sendError(res, 'Valve not found', [], 404);
    }

    const oldPos = valves[0].status;

    await connection.query(`UPDATE water_valves SET status = ? WHERE valve_id = ?`, [new_position, id]);

    await connection.query(
      `INSERT INTO water_valve_history (history_id, valve_id, old_position, new_position, operator_id, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`vhist-${Date.now()}`, id, oldPos, new_position, userId, reason]
    );

    await connection.commit();

    return sendSuccess(res, `Valve operated successfully! Status changed from ${oldPos} to ${new_position}`, {
      valve_id: id,
      old_position: oldPos,
      new_position: new_position
    });
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Valve operation failed', error.message, 500);
  } finally {
    connection.release();
  }
};

module.exports = {
  getPipelines,
  createPipeline,
  operateValve
};
