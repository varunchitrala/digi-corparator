/**
 * Pothole Volume Measurement & Status Engine
 */
const calculatePotholeVolume = (lengthMeters, widthMeters, depthMeters) => {
  const l = parseFloat(lengthMeters);
  const w = parseFloat(widthMeters);
  const d = parseFloat(depthMeters);

  if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) {
    return { valid: false, reason: 'Invalid pothole dimensions: Length, width, and depth must be positive numbers.' };
  }

  const areaM2 = l * w;
  const estimatedVolumeM3 = l * w * d;

  return {
    valid: true,
    length: l,
    width: w,
    depth: d,
    areaM2,
    estimatedVolumeM3
  };
};

module.exports = {
  calculatePotholeVolume
};
