/**
 * Prediction Service
 *
 * Heuristic-based short-term AQI prediction using weather factors.
 * This is NOT a machine-learning model — it's a rule-based estimator
 * that encodes well-known atmospheric chemistry relationships:
 *
 *   Wind    → disperses pollutants (lower AQI)
 *   Rain    → washes out particles (lower AQI)
 *   Humidity → can trap pollutants in low-wind (higher AQI)
 *   Heat    → accelerates ozone formation (higher AQI)
 *
 * The output is a directional forecast ("Increasing" / "Decreasing" / "Stable")
 * plus a predicted AQI value.
 */

const { clampAqi } = require('../utils/aqiConverter');

/**
 * @param {number} currentAqi    - fused AQI value
 * @param {object|null} weather  - weather data from weatherService
 * @returns {{ predictedAqi, trend, factors }}
 */
function predictAqi(currentAqi, weather) {
  if (!weather) {
    return {
      predictedAqi: currentAqi,
      trend: 'Stable',
      factors: ['No weather data available for prediction'],
    };
  }

  let delta = 0;           // net change to AQI
  const factors = [];      // human-readable explanation

  // ── Wind effect ──
  // Calm air traps pollutants; strong wind disperses them
  if (weather.windSpeed < 2) {
    delta += 25;
    factors.push('Low wind speed — pollutants stagnating');
  } else if (weather.windSpeed > 6) {
    delta -= 20;
    factors.push('Strong wind — pollutant dispersion expected');
  }

  // ── Rain washout ──
  // Even light rain scrubs particles from the air
  if (weather.rain1h > 0) {
    const washout = Math.min(weather.rain1h * 15, 40); // cap at -40
    delta -= washout;
    factors.push(`Rain (${weather.rain1h}mm/h) — particle washout effect`);
  }

  // ── Humidity stagnation ──
  // High humidity + low wind = pollution trapped near surface
  if (weather.humidity > 80 && weather.windSpeed < 3) {
    delta += 15;
    factors.push('High humidity with low wind — inversion-like conditions');
  }

  // ── Temperature / ozone effect ──
  // High temps accelerate photochemical smog (ozone production)
  if (weather.temp > 35) {
    delta += 15;
    factors.push('High temperature — increased ozone formation likely');
  }

  const predictedAqi = clampAqi(currentAqi + delta);

  // Determine trend
  let trend = 'Stable';
  if (delta > 10) trend = 'Increasing';
  else if (delta < -10) trend = 'Decreasing';

  return { predictedAqi, trend, factors };
}

module.exports = { predictAqi };
