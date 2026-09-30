const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc AI NagarSevak Natural Language Query Processor
 * @route POST /api/ai/query
 */
const queryAi = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return sendError(res, 'Prompt query is required', [], 400);
  }

  const queryText = String(prompt).toLowerCase();

  try {
    let reply = "";
    let dataContext = null;

    if (queryText.includes('complaint') || queryText.includes('pending') || queryText.includes('grievance')) {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN status = 'REGISTERED' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
                SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved
         FROM complaints WHERE ward_id = 'w-demo-024'`
      );
      const metrics = rows[0];
      reply = `In Ward 24 (Shivaji Nagar), there are currently ${metrics.total} total registered complaints: ${metrics.pending} pending initial assignment, ${metrics.in_progress} currently in progress with field engineers, and ${metrics.resolved} verified resolved.`;
      dataContext = metrics;
    } else if (queryText.includes('delayed') || queryText.includes('work') || queryText.includes('project')) {
      const [rows] = await pool.query(
        `SELECT work_code, work_title, physical_progress, status
         FROM works WHERE ward_id = 'w-demo-024' AND status = 'DELAYED'`
      );
      if (rows.length > 0) {
        reply = `There are ${rows.length} delayed infrastructure works in Ward 24: ${rows.map(w => `${w.work_code} (${w.work_title} - ${w.physical_progress}% complete)`).join(', ')}. Action required with Department Heads.`;
      } else {
        reply = `All active development projects in Ward 24 are currently on schedule.`;
      }
      dataContext = rows;
    } else if (queryText.includes('fund') || queryText.includes('budget') || queryText.includes('money') || queryText.includes('available')) {
      const [rows] = await pool.query(`SELECT total_allocated, utilized_amount, available_amount FROM budgets WHERE corporation_id = 'c-demo-001' LIMIT 1`);
      if (rows.length > 0) {
        const b = rows[0];
        reply = `Ward 24 Special Development Fund telemetry for FY 2026-27: Total Sanctioned: ₹${(b.total_allocated / 100000).toFixed(2)} Lakhs, Utilized: ₹${(b.utilized_amount / 100000).toFixed(2)} Lakhs (57.5%), Remaining Available: ₹${(b.available_amount / 100000).toFixed(2)} Lakhs.`;
        dataContext = b;
      }
    } else {
      reply = `I am AI NagarSevak, your smart ward management assistant. You can ask me about pending complaints, delayed works, available funds, or upcoming committee meetings in Ward 24.`;
    }

    return sendSuccess(res, 'AI response generated', {
      prompt,
      reply,
      dataContext,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return sendError(res, 'AI Processing error', error.message, 500);
  }
};

module.exports = {
  queryAi
};
