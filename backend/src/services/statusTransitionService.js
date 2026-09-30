/**
 * Municipal Complaint Status Transition Validation Service
 */

const ALLOWED_TRANSITIONS = {
  REGISTERED: ['TRIAGED', 'ASSIGNED', 'REJECTED', 'CANCELLED'],
  TRIAGED: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['ACCEPTED', 'REASSIGNED', 'REJECTED'],
  ACCEPTED: ['INSPECTION_PENDING', 'IN_PROGRESS', 'WAITING_FOR_INFORMATION'],
  INSPECTION_PENDING: ['INSPECTION_COMPLETED', 'IN_PROGRESS'],
  INSPECTION_COMPLETED: ['IN_PROGRESS', 'RESOLVED'],
  IN_PROGRESS: ['WAITING_FOR_INFORMATION', 'RESOLVED', 'ESCALATED'],
  WAITING_FOR_INFORMATION: ['IN_PROGRESS', 'RESOLVED'],
  RESOLVED: ['CITIZEN_VERIFICATION', 'CLOSED'],
  CITIZEN_VERIFICATION: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'], // Reopen allowed if citizen rejects
  REOPENED: ['ASSIGNED', 'IN_PROGRESS'],
  ESCALATED: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
  REJECTED: [],
  CANCELLED: []
};

/**
 * Validates if status transition from currentStatus to newStatus is allowed
 */
const validateStatusTransition = (currentStatus, newStatus, userRole = 'OFFICER') => {
  // SUPER_ADMIN can bypass transition checks if needed
  if (userRole === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  if (currentStatus === newStatus) {
    return { allowed: true };
  }

  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(newStatus)) {
    return {
      allowed: false,
      reason: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedNext.join(', ')}`
    };
  }

  return { allowed: true };
};

module.exports = {
  validateStatusTransition,
  ALLOWED_TRANSITIONS
};
