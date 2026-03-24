/**
 * Input validation helpers.
 */

/**
 * Validates latitude and longitude from query params.
 * Returns { valid, lat, lon, error }.
 */
function validateCoords(query) {
  const lat = parseFloat(query.lat);
  const lon = parseFloat(query.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return { valid: false, error: 'lat and lon are required and must be numbers' };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'lat must be between -90 and 90' };
  }
  if (lon < -180 || lon > 180) {
    return { valid: false, error: 'lon must be between -180 and 180' };
  }

  return { valid: true, lat, lon };
}

module.exports = { validateCoords };
