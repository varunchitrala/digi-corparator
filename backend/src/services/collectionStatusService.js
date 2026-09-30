const VALID_COLLECTION_STATUSES = [
  'SCHEDULED', 'ASSIGNED', 'STARTED', 'COLLECTED', 'MISSED', 'PARTIAL', 'REJECTED', 'CANCELLED'
];

const validateCollectionStatusTransition = (currentStatus, newStatus) => {
  if (!VALID_COLLECTION_STATUSES.includes(newStatus)) {
    return { valid: false, reason: `Invalid status: ${newStatus}` };
  }
  return { valid: true };
};

module.exports = {
  VALID_COLLECTION_STATUSES,
  validateCollectionStatusTransition
};
