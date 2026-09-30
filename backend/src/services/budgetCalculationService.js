const { pool } = require('../config/db');

/**
 * Available Budget Formula: Revised Budget - Reserved - Committed - Utilized
 */
const calculateAvailableBudget = (allocated = 0, reserved = 0, committed = 0, utilized = 0) => {
  const alloc = parseFloat(allocated || 0);
  const res = parseFloat(reserved || 0);
  const com = parseFloat(committed || 0);
  const uti = parseFloat(utilized || 0);
  return Math.max(0, alloc - res - com - uti);
};

/**
 * Utilization % Formula: (Utilized / Allocated) * 100
 */
const calculateUtilizationPercentage = (utilized = 0, allocated = 0) => {
  const uti = parseFloat(utilized || 0);
  const alloc = parseFloat(allocated || 0);
  if (alloc === 0) return 0;
  return Math.round((uti / alloc) * 100);
};

/**
 * Maker-Checker Security Rule: Creator cannot approve own financial transaction
 */
const validateMakerChecker = (createdBy, approvedBy, isMakerCheckerEnabled = true) => {
  if (!isMakerCheckerEnabled) return { valid: true };
  if (createdBy && approvedBy && createdBy === approvedBy) {
    return {
      valid: false,
      reason: 'Maker-Checker Violation: The user who created this financial record cannot approve it.'
    };
  }
  return { valid: true };
};

/**
 * Checks duplicate payment for a bill
 */
const checkDuplicatePayment = async (billId) => {
  try {
    const [rows] = await pool.query(`SELECT payment_id, payment_number FROM payments WHERE bill_id = ? AND status IN ('PAID', 'APPROVED', 'PROCESSED')`, [billId]);
    if (rows.length > 0) {
      return { isDuplicate: true, payment_number: rows[0].payment_number };
    }
    return { isDuplicate: false };
  } catch (err) {
    console.error('[Duplicate Payment Check Error]', err);
    return { isDuplicate: false };
  }
};

module.exports = {
  calculateAvailableBudget,
  calculateUtilizationPercentage,
  validateMakerChecker,
  checkDuplicatePayment
};
