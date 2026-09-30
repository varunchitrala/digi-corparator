/**
 * Waste Weighment & Mass Balance Engine
 */
const calculateNetWeight = (grossKg, tareKg) => {
  const gross = parseFloat(grossKg);
  const tare = parseFloat(tareKg);

  if (isNaN(gross) || isNaN(tare) || tare >= gross) {
    return { valid: false, reason: 'Invalid weighment values: Tare weight cannot be greater than or equal to gross weight.' };
  }

  const netWeight = gross - tare;
  return {
    valid: true,
    grossWeight: gross,
    tareWeight: tare,
    netWeight
  };
};

module.exports = {
  calculateNetWeight
};
