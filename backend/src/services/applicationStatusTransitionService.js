/**
 * 17-State Municipal Application Status Transition Engine
 */
const VALID_APPLICATION_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['PAYMENT_PENDING', 'UNDER_SCRUTINY', 'CANCELLED'],
  PAYMENT_PENDING: ['PAYMENT_COMPLETED', 'CANCELLED'],
  PAYMENT_COMPLETED: ['UNDER_SCRUTINY'],
  UNDER_SCRUTINY: ['DOCUMENT_VERIFICATION', 'CLARIFICATION_REQUIRED', 'REJECTED'],
  DOCUMENT_VERIFICATION: ['INSPECTION_PENDING', 'APPROVAL_PENDING', 'CLARIFICATION_REQUIRED', 'REJECTED'],
  INSPECTION_PENDING: ['INSPECTION_COMPLETED', 'CANCELLED'],
  INSPECTION_COMPLETED: ['APPROVAL_PENDING', 'REJECTED'],
  CLARIFICATION_REQUIRED: ['RESUBMITTED'],
  RESUBMITTED: ['UNDER_SCRUTINY', 'DOCUMENT_VERIFICATION'],
  APPROVAL_PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: ['CERTIFICATE_GENERATED'],
  REJECTED: ['CLOSED'],
  CERTIFICATE_GENERATED: ['DELIVERED', 'CLOSED'],
  DELIVERED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: []
};

const validateApplicationStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return { valid: true };
  const allowed = VALID_APPLICATION_TRANSITIONS[currentStatus] || [];
  if (allowed.includes(newStatus)) {
    return { valid: true };
  }
  return {
    valid: false,
    reason: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(', ') || 'None'}`
  };
};

module.exports = {
  validateApplicationStatusTransition
};
