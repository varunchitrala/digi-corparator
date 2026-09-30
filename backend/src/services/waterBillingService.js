/**
 * Water Meter Consumption & Slab Billing Engine
 */
const calculateWaterBillSlabs = (prevReading, currReading, connectionType = 'DOMESTIC') => {
  const previous = parseFloat(prevReading);
  const current = parseFloat(currReading);

  if (isNaN(previous) || isNaN(current) || current < previous) {
    return { valid: false, reason: 'Invalid water meter reading: Current reading cannot be less than previous reading.' };
  }

  const consumption = current - previous;
  let billAmount = 0;

  // Tiered Slabs (Domestic: 0-10 @ ₹15/unit, 11-20 @ ₹25/unit, 21+ @ ₹40/unit)
  if (consumption <= 10) {
    billAmount = consumption * 15;
  } else if (consumption <= 20) {
    billAmount = (10 * 15) + ((consumption - 10) * 25);
  } else {
    billAmount = (10 * 15) + (10 * 25) + ((consumption - 20) * 40);
  }

  // Commercial 2x multiplier
  if (connectionType === 'COMMERCIAL') billAmount *= 2;

  const fixedCharge = 150;
  const totalPayable = billAmount + fixedCharge;

  return {
    valid: true,
    consumption,
    billAmount,
    fixedCharge,
    totalPayable
  };
};

module.exports = {
  calculateWaterBillSlabs
};
