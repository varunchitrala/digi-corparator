/**
 * Municipal Development Work Status Transition Validation Service
 */

const WORK_TRANSITIONS = {
  DRAFT: ['PROPOSED', 'CANCELLED'],
  PROPOSED: ['ESTIMATE_PREPARED', 'REJECTED', 'CANCELLED'],
  ESTIMATE_PREPARED: ['TECHNICAL_APPROVAL_PENDING', 'CANCELLED'],
  TECHNICAL_APPROVAL_PENDING: ['TECHNICAL_APPROVED', 'REJECTED'],
  TECHNICAL_APPROVED: ['ADMIN_APPROVAL_PENDING'],
  ADMIN_APPROVAL_PENDING: ['ADMIN_APPROVED', 'REJECTED', 'ON_HOLD'],
  ADMIN_APPROVED: ['FINANCIAL_APPROVAL_PENDING'],
  FINANCIAL_APPROVAL_PENDING: ['FINANCIAL_APPROVED', 'REJECTED'],
  FINANCIAL_APPROVED: ['TENDER_PENDING', 'WORK_ORDER_ISSUED'],
  TENDER_PENDING: ['TENDERED', 'CANCELLED'],
  TENDERED: ['CONTRACTOR_SELECTED', 'CANCELLED'],
  CONTRACTOR_SELECTED: ['WORK_ORDER_ISSUED'],
  WORK_ORDER_ISSUED: ['NOT_STARTED'],
  NOT_STARTED: ['ONGOING', 'CANCELLED'],
  ONGOING: ['ON_HOLD', 'DELAYED', 'COMPLETED'],
  ON_HOLD: ['ONGOING', 'CANCELLED'],
  DELAYED: ['ONGOING', 'COMPLETED'],
  COMPLETED: ['FINAL_INSPECTION'],
  FINAL_INSPECTION: ['FINAL_APPROVED', 'ONGOING'],
  FINAL_APPROVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: []
};

/**
 * Validates if status transition from currentStatus to newStatus is allowed
 */
const validateWorkStatusTransition = (currentStatus, newStatus, userRole = 'CORPORATION_ADMIN') => {
  if (userRole === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  if (currentStatus === newStatus) {
    return { allowed: true };
  }

  const allowedNext = WORK_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(newStatus)) {
    return {
      allowed: false,
      reason: `Invalid work status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedNext.join(', ')}`
    };
  }

  return { allowed: true };
};

module.exports = {
  validateWorkStatusTransition,
  WORK_TRANSITIONS
};
