const VALID_LEAKAGE_STATUSES = [
  'REPORTED', 'INSPECTION_PENDING', 'CONFIRMED', 'WORK_ASSIGNED', 'IN_PROGRESS', 'REPAIRED', 'VERIFIED', 'CLOSED'
];

const validateLeakageStatusTransition = (currentStatus, newStatus) => {
  if (!VALID_LEAKAGE_STATUSES.includes(newStatus)) {
    return { valid: false, reason: `Invalid status: ${newStatus}` };
  }
  return { valid: true };
};

module.exports = {
  VALID_LEAKAGE_STATUSES,
  validateLeakageStatusTransition
};
