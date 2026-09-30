/**
 * Patient Health Data Privacy & Anonymization Engine
 */
const validateMedicalAccess = (userRole) => {
  const authorizedMedicalRoles = ['DOCTOR', 'MEDICAL_OFFICER', 'HEALTH_WORKER', 'SUPER_ADMIN'];
  if (!authorizedMedicalRoles.includes(userRole)) {
    return { valid: false, reason: 'Privacy Guard: Individual patient health records are strictly restricted to authorized medical officers and doctors.' };
  }
  return { valid: true };
};

module.exports = {
  validateMedicalAccess
};
