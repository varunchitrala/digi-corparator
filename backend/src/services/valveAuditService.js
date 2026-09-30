/**
 * Valve State Operation & Security Validator Engine
 */
const validateValveOperation = (userRole, newPosition) => {
  const allowedRoles = ['CORPORATION_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'OFFICER', 'STAFF'];
  if (!allowedRoles.includes(userRole)) {
    return { valid: false, reason: 'Unauthorized Valve Guard: Only authorized municipal engineers and supervisors can operate distribution valves.' };
  }

  const validPositions = ['OPEN', 'CLOSED', 'PARTIAL'];
  if (!validPositions.includes(newPosition)) {
    return { valid: false, reason: `Invalid valve position: ${newPosition}` };
  }

  return { valid: true };
};

module.exports = {
  validateValveOperation
};
