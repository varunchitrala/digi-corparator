/**
 * 12-State Municipal Tender Status Transition Engine
 */
const VALID_TENDER_TRANSITIONS = {
  DRAFT: ['PUBLISHED', 'CANCELLED'],
  PUBLISHED: ['OPEN', 'CLOSING_SOON', 'CLOSED', 'CANCELLED'],
  OPEN: ['CLOSING_SOON', 'CLOSED', 'CANCELLED'],
  CLOSING_SOON: ['CLOSED', 'CANCELLED'],
  CLOSED: ['UNDER_TECHNICAL_EVALUATION', 'CANCELLED'],
  UNDER_TECHNICAL_EVALUATION: ['UNDER_FINANCIAL_EVALUATION', 'REJECTED', 'CANCELLED'],
  UNDER_FINANCIAL_EVALUATION: ['AWAITING_APPROVAL', 'REJECTED', 'CANCELLED'],
  AWAITING_APPROVAL: ['AWARDED', 'REJECTED', 'CANCELLED'],
  AWARDED: ['ARCHIVED'],
  CANCELLED: [],
  REJECTED: [],
  ARCHIVED: []
};

const validateTenderStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return { valid: true };
  const allowed = VALID_TENDER_TRANSITIONS[currentStatus] || [];
  if (allowed.includes(newStatus)) {
    return { valid: true };
  }
  return {
    valid: false,
    reason: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(', ') || 'None'}`
  };
};

module.exports = {
  validateTenderStatusTransition
};
