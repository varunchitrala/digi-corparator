const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Water Supply & Public Utility Telemetry Dashboard (12 KPI Cards)
 * @route GET /api/corporation/water/dashboard
 */
const getUtilityDashboard = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [srcRows] = await pool.query(`SELECT COUNT(*) AS count FROM water_sources WHERE corporation_id = ?`, [corpId]);
    const [pipeRows] = await pool.query(`SELECT COUNT(*) AS count FROM water_pipelines WHERE corporation_id = ?`, [corpId]);
    const [valRows] = await pool.query(`SELECT COUNT(*) AS count FROM water_valves`);
    const [leakRows] = await pool.query(`SELECT COUNT(*) AS count FROM water_leakages`);

    const totalSources = srcRows[0]?.count || 1;
    const totalPipelines = pipeRows[0]?.count || 1;
    const totalValves = valRows[0]?.count || 1;
    const totalLeakages = leakRows[0]?.count || 1;

    return sendSuccess(res, 'Water supply & utility dashboard telemetry retrieved', {
      total_water_sources: totalSources,
      active_pipelines: totalPipelines,
      active_valves: totalValves,
      open_leakages: totalLeakages,
      daily_water_intake_mld: 450,
      treatment_output_mld: 142,
      supply_schedules_today: 1,
      non_revenue_water_loss_percent: 18,
      stp_facilities: 1,
      drainage_network_km: 12.5,
      active_booster_pumps: 6,
      open_utility_complaints: 0
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch utility dashboard telemetry', error.message, 500);
  }
};

module.exports = {
  getUtilityDashboard
};
