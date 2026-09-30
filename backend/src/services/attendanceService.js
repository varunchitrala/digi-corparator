/**
 * Geofence Validation Service (200m Radius Check)
 */
const validateGeofenceRadius = (userLat, userLng, officeLat = 19.8762, officeLng = 75.3433, radiusMeters = 500) => {
  const uLat = parseFloat(userLat);
  const uLng = parseFloat(userLng);
  const oLat = parseFloat(officeLat);
  const oLng = parseFloat(officeLng);

  if (isNaN(uLat) || isNaN(uLng)) {
    return { valid: false, reason: 'Invalid coordinates provided for check-in.' };
  }

  // Haversine Formula for distance calculation
  const R = 6371e3; // Earth radius in meters
  const dLat = (oLat - uLat) * (Math.PI / 180);
  const dLng = (oLng - uLng) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(uLat * (Math.PI / 180)) * Math.cos(oLat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance <= radiusMeters) {
    return { valid: true, distance: Math.round(distance) };
  }

  return {
    valid: false,
    reason: `Geofence Violation: You are ${Math.round(distance)}m away from assigned municipal office (Max allowed: ${radiusMeters}m).`
  };
};

module.exports = {
  validateGeofenceRadius
};
