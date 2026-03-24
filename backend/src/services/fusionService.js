/**
 * Fusion Service
 *
 * This is the core intelligence layer. It takes raw readings from
 * multiple AQI sources and produces a single, trustworthy AQI value.
 *
 * Strategy:
 *   1. If both sources available → weighted average (WAQI weighted higher
 *      because it's already EPA-calibrated from local stations)
 *   2. If one source missing    → use the available one
 *   3. If zero sources          → return null (handled by controller)
 *
 * Also fuses PM2.5/PM10 by taking the worst-case (conservative approach
 * for health-sensitive applications).
 */

const { clampAqi } = require('../utils/aqiConverter');
const { calculateConfidence } = require('../utils/confidence');

// WAQI is station-calibrated, so we trust it slightly more
const WEIGHT_WAQI = 0.6;
const WEIGHT_OW = 0.4;

/**
 * @param {Array} sources  - array of normalised source objects from aqiService
 * @returns {{ aqi, pm25, pm10, confidence, sources } | null}
 */
function fuseAqiData(sources) {
  if (!sources || sources.length === 0) return null;

  const ow = sources.find((s) => s.source === 'openweather');
  const waqi = sources.find((s) => s.source === 'waqi');

  // ── Fuse AQI value ──
  let fusedAqi;
  if (ow && waqi && ow.aqiEpa >= 0 && waqi.aqiEpa != null) {
    // Weighted average when both available
    fusedAqi = clampAqi(waqi.aqiEpa * WEIGHT_WAQI + ow.aqiEpa * WEIGHT_OW);
  } else if (waqi?.aqiEpa != null) {
    fusedAqi = clampAqi(waqi.aqiEpa);
  } else if (ow?.aqiEpa >= 0) {
    fusedAqi = clampAqi(ow.aqiEpa);
  } else {
    return null;
  }

  // ── Fuse particulate matter (worst-case for safety) ──
  const pm25 = worstCase(ow?.pm25, waqi?.pm25);
  const pm10 = worstCase(ow?.pm10, waqi?.pm10);

  // ── Confidence ──
  const confidence = calculateConfidence(
    ow?.aqiEpa >= 0 ? ow.aqiEpa : null,
    waqi?.aqiEpa ?? null,
  );

  return {
    value: fusedAqi,
    pm25,
    pm10,
    confidence: confidence.score,
    confidenceDetail: confidence.detail,
    sourcesUsed: sources.map((s) => s.source),
    dominantPollutant: waqi?.dominantPollutant ?? null,
    stationName: waqi?.stationName ?? null,
  };
}

/**
 * Conservative merge: take the higher (worse) reading for health safety.
 */
function worstCase(a, b) {
  if (a == null) return b ?? null;
  if (b == null) return a;
  return Math.max(a, b);
}

module.exports = { fuseAqiData };
