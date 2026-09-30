/**
 * 10-State Municipal Employee Status Transition Engine
 */
const VALID_EMPLOYEE_TRANSITIONS = {
  PROBATION: ['ACTIVE', 'TERMINATED', 'RESIGNED'],
  ACTIVE: ['INACTIVE', 'SUSPENDED', 'ON_NOTICE', 'RETIRED', 'RESIGNED', 'TERMINATED', 'DECEASED'],
  INACTIVE: ['ACTIVE', 'ARCHIVED'],
  SUSPENDED: ['ACTIVE', 'TERMINATED', 'RESIGNED'],
  ON_NOTICE: ['RESIGNED', 'TERMINATED', 'ACTIVE'],
  RESIGNED: [],
  RETIRED: [],
  TERMINATED: [],
  DECEASED: []
};

const validateEmployeeStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return { valid: true };
  const allowed = VALID_EMPLOYEE_TRANSITIONS[currentStatus] || [];
  if (allowed.includes(newStatus)) {
    return { valid: true };
  }
  return {
    valid: false,
    reason: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(', ') || 'None'}`
  };
};

module.exports = {
  validateEmployeeStatusTransition
};
