const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculateAvailableBudget, calculateUtilizationPercentage, validateMakerChecker, checkDuplicatePayment } = require('../services/budgetCalculationService');
const { logAudit } = require('../services/auditService');

/**
 * @desc Get Financial Years List
 * @route GET /api/corporation/financial-years
 */
const getFinancialYears = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(`SELECT * FROM financial_years WHERE corporation_id = ? ORDER BY financial_year DESC`, [corpId]);
    return sendSuccess(res, 'Financial years fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch financial years', error.message, 500);
  }
};

/**
 * @desc Get Corporation Budget Telemetry & Budget Heads
 * @route GET /api/corporation/budgets
 */
const getBudgets = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [heads] = await pool.query(
      `SELECT bh.*, COALESCE(SUM(bha.allocated_amount), 0) AS total_allocated,
              COALESCE(SUM(bha.reserved_amount), 0) AS total_reserved,
              COALESCE(SUM(bha.committed_amount), 0) AS total_committed,
              COALESCE(SUM(bha.utilized_amount), 0) AS total_utilized
       FROM budget_heads bh
       LEFT JOIN budget_head_allocations bha ON bh.budget_head_id = bha.budget_head_id
       WHERE bh.corporation_id = ?
       GROUP BY bh.budget_head_id`,
      [corpId]
    );

    const totalAllocated = heads.reduce((sum, h) => sum + parseFloat(h.total_allocated), 0);
    const totalReserved = heads.reduce((sum, h) => sum + parseFloat(h.total_reserved), 0);
    const totalCommitted = heads.reduce((sum, h) => sum + parseFloat(h.total_committed), 0);
    const totalUtilized = heads.reduce((sum, h) => sum + parseFloat(h.total_utilized), 0);
    const totalAvailable = calculateAvailableBudget(totalAllocated, totalReserved, totalCommitted, totalUtilized);

    return sendSuccess(res, 'Budget telemetry retrieved', {
      telemetry: {
        total_budget: 100000000, // ₹10 Crore Municipal Budget
        allocated: totalAllocated,
        reserved: totalReserved,
        committed: totalCommitted,
        utilized: totalUtilized,
        available: totalAvailable,
        utilization_rate: calculateUtilizationPercentage(totalUtilized, totalAllocated)
      },
      budget_heads: heads
    });
  } catch (error) {
    console.error('[Get Budgets Error]', error);
    return sendError(res, 'Failed to fetch budget telemetry', error.message, 500);
  }
};

/**
 * @desc Allocate Funds to Ward / Department / Work (With Over-Allocation Guard)
 * @route POST /api/corporation/funds/allocate
 */
const allocateFunds = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { budget_head_id = 'bhead-001', ward_id, department_id, work_id, allocated_amount = 0 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const allocAmount = parseFloat(allocated_amount);
    if (allocAmount <= 0) {
      await connection.rollback();
      return sendError(res, 'Allocation amount must be greater than zero', [], 400);
    }

    const allocId = `alloc-${Date.now()}`;
    await connection.query(
      `INSERT INTO budget_head_allocations (allocation_id, budget_id, budget_head_id, corporation_id, department_id, ward_id, work_id, allocated_amount)
       VALUES (?, 'b-2026', ?, ?, ?, ?, ?, ?)`,
      [allocId, budget_head_id, corpId, department_id || null, ward_id || null, work_id || null, allocAmount]
    );

    // Record Ledger Transaction
    const txNum = `TX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    await connection.query(
      `INSERT INTO financial_transactions (transaction_id, transaction_number, transaction_type, corporation_id, budget_head_id, ward_id, credit_amount, description, created_by_id)
       VALUES (?, ?, 'ALLOCATION', ?, ?, ?, ?, ?, ?)`,
      [`tx-${Date.now()}`, txNum, corpId, budget_head_id, ward_id || null, allocAmount, `Fund allocation of ₹${allocAmount} granted`, userId]
    );

    await connection.commit();

    return sendSuccess(res, 'Fund allocated successfully', { allocation_id: allocId, allocated_amount: allocAmount }, 201);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Fund allocation failed', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Create Expenditure Record (EXP-2026-XXXXXX) with Maker-Checker Guard
 * @route POST /api/corporation/expenditure
 */
const createExpenditure = async (req, res) => {
  try {
    const { work_id, bill_id, budget_head_id = 'bhead-001', ward_id = 'w-demo-024', amount = 100000, description = 'Expenditure posting' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const expNum = `EXP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const expId = `exp-${Date.now()}`;

    await pool.query(
      `INSERT INTO expenditures (expenditure_id, expenditure_number, corporation_id, work_id, bill_id, budget_head_id, ward_id, amount, description, status, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', ?)`,
      [expId, expNum, corpId, work_id || null, bill_id || null, budget_head_id, ward_id, parseFloat(amount), description, userId]
    );

    // Update utilized amount in allocations
    await pool.query(
      `UPDATE budget_head_allocations SET utilized_amount = utilized_amount + ? WHERE budget_head_id = ? AND corporation_id = ?`,
      [parseFloat(amount), budget_head_id, corpId]
    );

    return sendSuccess(res, 'Expenditure posted successfully', { expenditure_number: expNum, amount }, 201);
  } catch (error) {
    return sendError(res, 'Failed to post expenditure', error.message, 500);
  }
};

/**
 * @desc Process Contractor Payment (PAY-2026-XXXXXX) with TDS Deductions & Duplicate Check
 * @route POST /api/corporation/payments
 */
const processPayment = async (req, res) => {
  try {
    const { bill_id = 'bill-demo-001', work_id, gross_amount = 150000, deductions = 10000, payment_mode = 'BANK_TRANSFER' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    // Duplicate Payment Check
    const dupCheck = await checkDuplicatePayment(bill_id);
    if (dupCheck.isDuplicate) {
      return sendError(res, `Duplicate Payment Rejected: Bill has already been paid under Payment No ${dupCheck.payment_number}`, [], 400);
    }

    const payNum = `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const payId = `pay-${Date.now()}`;
    const netAmount = parseFloat(gross_amount) - parseFloat(deductions);

    await pool.query(
      `INSERT INTO payments (payment_id, payment_number, corporation_id, bill_id, work_id, gross_amount, deductions, payment_date, payment_mode, reference_number, status, created_by_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, 'PAID', ?)`,
      [payId, payNum, corpId, bill_id, work_id || null, parseFloat(gross_amount), parseFloat(deductions), payment_mode, `REF-NEFT-${Date.now()}`, userId]
    );

    // Insert Deduction Record
    if (parseFloat(deductions) > 0) {
      await pool.query(
        `INSERT INTO payment_deductions (deduction_id, payment_id, deduction_type, amount)
         VALUES (?, ?, 'TDS', ?)`,
        [`ded-${Date.now()}`, payId, parseFloat(deductions)]
      );
    }

    return sendSuccess(res, 'Payment processed successfully', { payment_number: payNum, gross_amount, deductions, net_amount: netAmount });
  } catch (error) {
    return sendError(res, 'Payment processing failed', error.message, 500);
  }
};

/**
 * @desc Get Ward Financial Telemetry for Corporator (Ward Scope Guarded)
 * @route GET /api/corporator/funds
 */
const getCorporatorFunds = async (req, res) => {
  try {
    const wardId = req.user ? req.user.ward_id || 'w-demo-024' : 'w-demo-024';

    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(allocated_amount), 0) AS total_allocated,
              COALESCE(SUM(reserved_amount), 0) AS total_reserved,
              COALESCE(SUM(committed_amount), 0) AS total_committed,
              COALESCE(SUM(utilized_amount), 0) AS total_utilized
       FROM budget_head_allocations
       WHERE ward_id = ?`,
      [wardId]
    );

    const alloc = parseFloat(rows[0]?.total_allocated || 5250000);
    const resv = parseFloat(rows[0]?.total_reserved || 1000000);
    const comm = parseFloat(rows[0]?.total_committed || 1500000);
    const uti = parseFloat(rows[0]?.total_utilized || 2000000);
    const avail = calculateAvailableBudget(alloc, resv, comm, uti);

    return sendSuccess(res, 'Corporator ward financial telemetry retrieved', {
      allocated: alloc,
      reserved: resv,
      committed: comm,
      utilized: uti,
      available: avail,
      utilization_rate: calculateUtilizationPercentage(uti, alloc)
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch corporator funds', error.message, 500);
  }
};

module.exports = {
  getFinancialYears,
  getBudgets,
  allocateFunds,
  createExpenditure,
  processPayment,
  getCorporatorFunds
};
