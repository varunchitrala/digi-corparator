/**
 * Development Work Financial & Progress Calculation Service
 */

/**
 * Calculates itemized technical estimate total amount
 */
const calculateEstimateTotal = (items = []) => {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity || 0);
    const rate = parseFloat(item.rate || 0);
    return sum + (qty * rate);
  }, 0);
};

/**
 * Calculates net bill amount (Gross - Deductions)
 */
const calculateNetBill = (grossAmount, deductions = 0) => {
  const gross = parseFloat(grossAmount || 0);
  const ded = parseFloat(deductions || 0);
  return Math.max(0, gross - ded);
};

/**
 * Validates that sequence milestone percentages sum to 100%
 */
const validateMilestonesPercentage = (milestones = []) => {
  const total = milestones.reduce((sum, m) => sum + parseInt(m.percentage || 0, 10), 0);
  if (total !== 100) {
    return {
      valid: false,
      reason: `Total milestone percentage must equal 100%. Current sum: ${total}%`
    };
  }
  return { valid: true };
};

/**
 * Checks if work is past target completion date and calculates delay days
 */
const checkWorkDelay = (targetCompletionDate, currentStatus) => {
  if (!targetCompletionDate || ['COMPLETED', 'CLOSED', 'CANCELLED'].includes(currentStatus)) {
    return { isDelayed: false, delayDays: 0 };
  }

  const targetDate = new Date(targetCompletionDate);
  const now = new Date();

  if (now > targetDate) {
    const diffMs = now - targetDate;
    const delayDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { isDelayed: true, delayDays };
  }

  return { isDelayed: false, delayDays: 0 };
};

module.exports = {
  calculateEstimateTotal,
  calculateNetBill,
  validateMilestonesPercentage,
  checkWorkDelay
};
