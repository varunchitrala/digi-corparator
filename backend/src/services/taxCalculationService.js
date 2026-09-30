/**
 * Server-Side Property Tax Calculation Engine
 */
const calculatePropertyTax = (builtUpArea = 1000, propertyType = 'RESIDENTIAL', ageYears = 5) => {
  let ratePerSqFt = 10;
  if (propertyType === 'COMMERCIAL') ratePerSqFt = 25;
  if (propertyType === 'INDUSTRIAL') ratePerSqFt = 35;

  const baseTaxable = parseFloat(builtUpArea) * ratePerSqFt;
  const ageDepreciation = Math.min(baseTaxable * 0.2, ageYears * 100);
  const netTax = Math.max(1000, baseTaxable - ageDepreciation);

  return {
    ratePerSqFt,
    baseTaxable,
    netTax
  };
};

module.exports = {
  calculatePropertyTax
};
