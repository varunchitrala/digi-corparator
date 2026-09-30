const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { calculatePropertyTax } = require('../services/taxCalculationService');

/**
 * @desc Get Bills Register
 * @route GET /api/corporation/revenue/bills
 */
const getBills = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT b.*, p.property_number, p.owner_name
       FROM bills b
       JOIN properties p ON b.property_id = p.property_id
       WHERE p.corporation_id = ?
       ORDER BY b.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Bills register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch bills', error.message, 500);
  }
};

/**
 * @desc Generate Tax Demand & Bill (BILL-2026-XXXXXX)
 * @route POST /api/corporation/revenue/bills/generate
 */
const generateTaxBill = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { property_id = 'prop-001', financial_year = '2026-2027', base_amount = 12000 } = req.body;

    const demNum = `DEM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const billNum = `BILL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const demId = `dem-${Date.now()}`;
    const billId = `bill-${Date.now()}`;

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 2);

    await connection.query(
      `INSERT INTO tax_demands (demand_id, demand_number, property_id, financial_year, base_amount, total_amount, outstanding_amount, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'GENERATED')`,
      [demId, demNum, property_id, financial_year, parseFloat(base_amount), parseFloat(base_amount), parseFloat(base_amount), dueDate]
    );

    await connection.query(
      `INSERT INTO bills (bill_id, bill_number, demand_id, property_id, bill_type, billing_period, subtotal, total_amount, outstanding_amount, due_date, status)
       VALUES (?, ?, ?, ?, 'PROPERTY_TAX', ?, ?, ?, ?, ?, 'GENERATED')`,
      [billId, billNum, demId, property_id, `FY ${financial_year}`, parseFloat(base_amount), parseFloat(base_amount), parseFloat(base_amount), dueDate]
    );

    await connection.query(
      `INSERT INTO revenue_ledger (ledger_id, corporation_id, property_id, bill_id, transaction_type, debit, balance)
       VALUES (?, 'c-demo-001', ?, ?, 'DEMAND', ?, ?)`,
      [`ledg-${Date.now()}`, property_id, billId, parseFloat(base_amount), parseFloat(base_amount)]
    );

    await connection.commit();

    return sendSuccess(res, 'Tax bill generated successfully', { bill_id: billId, bill_number: billNum, total_amount: base_amount }, 201);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Tax bill generation failed', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Process Tax Payment & Generate Receipt (REC-2026-XXXXXX) with Server-Side Amount Overriding
 * @route POST /api/corporation/revenue/bills/:id/pay
 */
const payTaxBill = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params; // bill_id

    const [bills] = await connection.query(`SELECT * FROM bills WHERE bill_id = ?`, [id]);
    if (bills.length === 0) {
      await connection.rollback();
      return sendError(res, 'Bill not found', [], 404);
    }

    const bill = bills[0];
    if (bill.status === 'PAID') {
      await connection.rollback();
      return sendError(res, 'Bill is already paid', [], 400);
    }

    // SERVER-SIDE AMOUNT OVERRIDING: Always charge the actual outstanding amount!
    const payableAmount = parseFloat(bill.outstanding_amount);
    const recNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    await connection.query(
      `UPDATE bills SET paid_amount = total_amount, outstanding_amount = 0.00, status = 'PAID' WHERE bill_id = ?`,
      [id]
    );

    if (bill.demand_id) {
      await connection.query(
        `UPDATE tax_demands SET paid_amount = total_amount, outstanding_amount = 0.00, status = 'PAID' WHERE demand_id = ?`,
        [bill.demand_id]
      );
    }

    await connection.query(
      `INSERT INTO revenue_ledger (ledger_id, corporation_id, property_id, bill_id, transaction_type, credit, balance)
       VALUES (?, 'c-demo-001', ?, ?, 'PAYMENT', ?, 0.00)`,
      [`ledg-${Date.now()}`, bill.property_id, id, payableAmount]
    );

    await connection.commit();

    return sendSuccess(res, 'Tax payment processed successfully', {
      receipt_number: recNum,
      paid_amount: payableAmount,
      outstanding_amount: 0
    });
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Payment processing failed', error.message, 500);
  } finally {
    connection.release();
  }
};

module.exports = {
  getBills,
  generateTaxBill,
  payTaxBill
};
