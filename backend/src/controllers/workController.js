const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateWorkStatusTransition } = require('../services/workStatusTransitionService');
const { calculateEstimateTotal, calculateNetBill, validateMilestonesPercentage, checkWorkDelay } = require('../services/workCalculationService');
const { logAudit } = require('../services/auditService');

/**
 * @desc Get List of Development Works (Filtered by Corporation/Ward/Status)
 * @route GET /api/corporation/works
 */
const getWorks = async (req, res) => {
  try {
    const { ward_id, status, category_id, department_id, search, limit = 50, offset = 0 } = req.query;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    let query = `
      SELECT w.*, wc.category_name, ward.ward_name, d.department_name, c.company_name AS contractor_name
      FROM works w
      LEFT JOIN work_categories wc ON w.category_id = wc.category_id
      LEFT JOIN wards ward ON w.ward_id = ward.ward_id
      LEFT JOIN departments d ON w.department_id = d.department_id
      LEFT JOIN contractors c ON w.contractor_id = c.contractor_id
      WHERE w.corporation_id = ? AND w.deleted_at IS NULL
    `;

    const params = [corpId];

    if (ward_id) {
      query += ` AND w.ward_id = ?`;
      params.push(ward_id);
    }
    if (status) {
      query += ` AND w.status = ?`;
      params.push(status);
    }
    if (category_id) {
      query += ` AND w.category_id = ?`;
      params.push(category_id);
    }
    if (department_id) {
      query += ` AND w.department_id = ?`;
      params.push(department_id);
    }
    if (search) {
      query += ` AND (w.work_code LIKE ? OR w.work_title LIKE ? OR w.location_address LIKE ?)`;
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    query += ` ORDER BY w.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, params);

    // Compute delay indicators for each work
    const enrichedWorks = rows.map((w) => {
      const delayInfo = checkWorkDelay(w.target_completion_date || w.target_date, w.status);
      return { ...w, ...delayInfo };
    });

    return sendSuccess(res, 'Development works retrieved', enrichedWorks);
  } catch (error) {
    console.error('[Get Works Error]', error);
    return sendError(res, 'Failed to fetch development works', error.message, 500);
  }
};

/**
 * @desc Get Full Work Details by ID (13-Tab Aggregated Telemetry)
 * @route GET /api/corporation/works/:id
 */
const getWorkById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT w.*, wc.category_name, ward.ward_name, d.department_name, c.company_name AS contractor_name
       FROM works w
       LEFT JOIN work_categories wc ON w.category_id = wc.category_id
       LEFT JOIN wards ward ON w.ward_id = ward.ward_id
       LEFT JOIN departments d ON w.department_id = d.department_id
       LEFT JOIN contractors c ON w.contractor_id = c.contractor_id
       WHERE w.work_id = ? OR w.work_code = ?`,
      [id, id]
    );

    if (rows.length === 0) {
      return sendError(res, 'Development work not found', [], 404);
    }

    const work = rows[0];

    // Fetch Estimate Items
    const [estimateItems] = await pool.query(`SELECT * FROM work_estimate_items WHERE work_id = ?`, [work.work_id]);

    // Fetch Approval History
    const [approvalHistory] = await pool.query(`SELECT * FROM work_approval_history WHERE work_id = ? ORDER BY created_at ASC`, [work.work_id]);

    // Fetch Work Orders
    const [workOrders] = await pool.query(`SELECT * FROM work_orders WHERE work_id = ?`, [work.work_id]);

    // Fetch Milestones
    const [milestones] = await pool.query(`SELECT * FROM work_milestones WHERE work_id = ? ORDER BY sequence ASC`, [work.work_id]);

    // Fetch Progress History
    const [progressHistory] = await pool.query(`SELECT * FROM work_progress_history WHERE work_id = ? ORDER BY created_at DESC`, [work.work_id]);

    // Fetch Inspections
    const [inspections] = await pool.query(`SELECT * FROM work_inspections WHERE work_id = ? ORDER BY created_at DESC`, [work.work_id]);

    // Fetch Bills
    const [bills] = await pool.query(`SELECT * FROM work_bills WHERE work_id = ? ORDER BY created_at DESC`, [work.work_id]);

    work.estimate_items = estimateItems;
    work.approval_history = approvalHistory;
    work.work_order = workOrders[0] || null;
    work.milestones = milestones;
    work.progress_history = progressHistory;
    work.inspections = inspections;
    work.bills = bills;

    return sendSuccess(res, 'Work details retrieved', work);
  } catch (error) {
    return sendError(res, 'Failed to fetch work details', error.message, 500);
  }
};

/**
 * @desc Create New Development Work with Technical Estimate Items (Transaction Safe)
 * @route POST /api/corporation/works
 */
const createWork = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      work_title,
      description,
      ward_id = 'w-demo-024',
      department_id = 'd-demo-001',
      category_id = 'wcat-001',
      source_type = 'CORPORATION_PLAN',
      location_address,
      latitude = 19.8762,
      longitude = 75.3433,
      estimate_items = []
    } = req.body;

    if (!work_title || !description || !location_address) {
      await connection.rollback();
      return sendError(res, 'Work title, description, and location address are required', [], 400);
    }

    const tenantId = req.user ? req.user.tenant_id || 't-demo-001' : 't-demo-001';
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    // Auto generate work code WORK-2026-XXXXXX
    const workCode = `WORK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const workId = `work-${Date.now()}`;

    // Server-side estimate calculation
    const estimatedCost = calculateEstimateTotal(estimate_items);

    await connection.query(
      `INSERT INTO works
        (work_id, work_code, tenant_id, corporation_id, ward_id, department_id, category_id, work_title, description, source_type, location_address, latitude, longitude, estimated_cost, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROPOSED', ?)`,
      [
        workId, workCode, tenantId, corpId, ward_id, department_id, category_id,
        work_title, description, source_type, location_address, latitude, longitude, estimatedCost, userId
      ]
    );

    // Insert Estimate Items if provided
    for (const item of estimate_items) {
      const itemId = `est-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await connection.query(
        `INSERT INTO work_estimate_items (item_id, work_id, item_name, description, quantity, unit, rate)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [itemId, workId, item.item_name, item.description || '', parseFloat(item.quantity), item.unit || 'unit', parseFloat(item.rate)]
      );
    }

    // Insert Approval History Entry
    await connection.query(
      `INSERT INTO work_approval_history (history_id, work_id, approval_type, from_status, to_status, approved_by_id, remarks)
       VALUES (?, ?, 'OTHER', NULL, 'PROPOSED', ?, 'Work proposal created with technical estimate')`,
      [`apph-${Date.now()}`, workId, userId]
    );

    await connection.commit();

    await logAudit({
      user_id: userId,
      tenant_id: tenantId,
      corporation_id: corpId,
      action: 'WORK_CREATED',
      module: 'WORKS',
      details: { work_code: workCode, work_title }
    });

    return sendSuccess(res, 'Development work created successfully', {
      work_id: workId,
      work_code: workCode,
      estimated_cost: estimatedCost,
      status: 'PROPOSED'
    }, 201);
  } catch (error) {
    await connection.rollback();
    console.error('[Create Work Error]', error);
    return sendError(res, 'Failed to create development work', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Submit Work Approval (Technical, Administrative, or Financial)
 * @route POST /api/corporation/works/:id/approve
 */
const submitApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approval_type = 'ADMINISTRATIVE', approved_amount = 0, remarks = 'Approved' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const [rows] = await pool.query(`SELECT work_id, status, estimated_cost FROM works WHERE work_id = ? OR work_code = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Work not found', [], 404);
    const work = rows[0];

    let nextStatus = 'ADMIN_APPROVED';
    if (approval_type === 'TECHNICAL') nextStatus = 'TECHNICAL_APPROVED';
    if (approval_type === 'FINANCIAL') nextStatus = 'FINANCIAL_APPROVED';

    const appCost = approved_amount > 0 ? approved_amount : work.estimated_cost;

    await pool.query(
      `UPDATE works SET status = ?, approved_cost = ?, updated_at = NOW() WHERE work_id = ?`,
      [nextStatus, appCost, work.work_id]
    );

    await pool.query(
      `INSERT INTO work_approval_history (history_id, work_id, approval_type, from_status, to_status, approved_by_id, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`apph-${Date.now()}`, work.work_id, approval_type, work.status, nextStatus, userId, remarks]
    );

    return sendSuccess(res, `Work ${approval_type.toLowerCase()} approval granted`, { status: nextStatus, approved_cost: appCost });
  } catch (error) {
    return sendError(res, 'Failed to process approval', error.message, 500);
  }
};

/**
 * @desc Issue Work Order to Assigned Contractor (WO-2026-XXXXXX)
 * @route POST /api/corporation/works/:id/work-order
 */
const issueWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { contractor_id = 'cnt-001', contract_amount = 500000, start_date = '2026-09-01', target_completion_date = '2026-12-31', terms_conditions } = req.body;

    const [rows] = await pool.query(`SELECT work_id, status FROM works WHERE work_id = ? OR work_code = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Work not found', [], 404);
    const work = rows[0];

    const woNumber = `WO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const woId = `wo-${Date.now()}`;

    await pool.query(
      `INSERT INTO work_orders (work_order_id, work_order_number, work_id, contractor_id, issue_date, start_date, target_completion_date, contract_amount, terms_conditions)
       VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)`,
      [woId, woNumber, work.work_id, contractor_id, start_date, target_completion_date, contract_amount, terms_conditions || 'Standard municipal work terms apply']
    );

    // Update Work Status to WORK_ORDER_ISSUED & assign contractor
    await pool.query(
      `UPDATE works SET contractor_id = ?, contract_cost = ?, start_date = ?, target_completion_date = ?, status = 'WORK_ORDER_ISSUED', updated_at = NOW() WHERE work_id = ?`,
      [contractor_id, contract_amount, start_date, target_completion_date, work.work_id]
    );

    return sendSuccess(res, 'Work order issued successfully', { work_order_number: woNumber, status: 'WORK_ORDER_ISSUED' });
  } catch (error) {
    return sendError(res, 'Failed to issue work order', error.message, 500);
  }
};

/**
 * @desc Register Work Sequence Milestones (Validates Sum === 100%)
 * @route POST /api/corporation/works/:id/milestones
 */
const addMilestones = async (req, res) => {
  try {
    const { id } = req.params;
    const { milestones = [] } = req.body;

    const validation = validateMilestonesPercentage(milestones);
    if (!validation.valid) {
      return sendError(res, validation.reason, [], 400);
    }

    const [rows] = await pool.query(`SELECT work_id FROM works WHERE work_id = ? OR work_code = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Work not found', [], 404);
    const workId = rows[0].work_id;

    // Delete existing draft milestones and insert new
    await pool.query(`DELETE FROM work_milestones WHERE work_id = ?`, [workId]);

    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      const mId = `ms-${Date.now()}-${i}`;
      await pool.query(
        `INSERT INTO work_milestones (milestone_id, work_id, milestone_name, sequence, percentage, status)
         VALUES (?, ?, ?, ?, ?, 'NOT_STARTED')`,
        [mId, workId, m.milestone_name, i + 1, parseInt(m.percentage, 10)]
      );
    }

    return sendSuccess(res, 'Work milestones registered successfully');
  } catch (error) {
    return sendError(res, 'Failed to register milestones', error.message, 500);
  }
};

/**
 * @desc Update Physical & Financial Work Progress %
 * @route POST /api/corporation/works/:id/progress
 */
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { physical_progress = 0, financial_progress = 0, remarks } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    if (physical_progress < 0 || physical_progress > 100 || financial_progress < 0 || financial_progress > 100) {
      return sendError(res, 'Progress percentages must be between 0 and 100', [], 400);
    }

    const [rows] = await pool.query(`SELECT work_id, status FROM works WHERE work_id = ? OR work_code = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Work not found', [], 404);
    const work = rows[0];

    const histId = `wph-${Date.now()}`;
    await pool.query(
      `INSERT INTO work_progress_history (history_id, work_id, physical_progress, financial_progress, remarks, updated_by_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [histId, work.work_id, physical_progress, financial_progress, remarks || 'Progress updated', userId]
    );

    let nextStatus = work.status;
    if (physical_progress > 0 && work.status === 'WORK_ORDER_ISSUED') nextStatus = 'ONGOING';
    if (physical_progress === 100) nextStatus = 'COMPLETED';

    await pool.query(
      `UPDATE works SET physical_progress = ?, financial_progress = ?, status = ?, updated_at = NOW() WHERE work_id = ?`,
      [physical_progress, financial_progress, nextStatus, work.work_id]
    );

    return sendSuccess(res, `Progress updated to ${physical_progress}% Physical / ${financial_progress}% Financial`, { status: nextStatus });
  } catch (error) {
    return sendError(res, 'Failed to update progress', error.message, 500);
  }
};

/**
 * @desc Submit Running or Final Bill (Net Amount Calculated Server-Side)
 * @route POST /api/corporation/works/:id/bills
 */
const submitBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { bill_type = 'RUNNING', gross_amount = 100000, deductions = 5000 } = req.body;

    const [rows] = await pool.query(`SELECT work_id FROM works WHERE work_id = ? OR work_code = ?`, [id, id]);
    if (rows.length === 0) return sendError(res, 'Work not found', [], 404);
    const workId = rows[0].work_id;

    const billNumber = `BILL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const billId = `bill-${Date.now()}`;
    const netAmount = calculateNetBill(gross_amount, deductions);

    await pool.query(
      `INSERT INTO work_bills (bill_id, bill_number, work_id, bill_type, bill_date, gross_amount, deductions, status)
       VALUES (?, ?, ?, ?, CURDATE(), ?, ?, 'SUBMITTED')`,
      [billId, billNumber, workId, bill_type, parseFloat(gross_amount), parseFloat(deductions)]
    );

    return sendSuccess(res, 'Work bill submitted successfully', { bill_number: billNumber, gross_amount, deductions, net_amount: netAmount });
  } catch (error) {
    return sendError(res, 'Failed to submit bill', error.message, 500);
  }
};

module.exports = {
  getWorks,
  getWorkById,
  createWork,
  submitApproval,
  issueWorkOrder,
  addMilestones,
  updateProgress,
  submitBill
};
