/**
 * GIS Geo-Validation Service
 */
const validateGeoCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return { valid: false, reason: 'Latitude must be a valid number between -90 and +90 degrees.' };
  }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return { valid: false, reason: 'Longitude must be a valid number between -180 and +180 degrees.' };
  }

  return { valid: true, latitude, longitude };
};

module.exports = {
  validateGeoCoordinates
};
