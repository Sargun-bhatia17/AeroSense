/**
 * AQI Scale Converter
 *
 * OpenWeather uses a proprietary 1–5 scale for its Air Pollution API.
 * We normalise everything to the US EPA 0–500 AQI scale so both
 * sources (OpenWeather + WAQI) are directly comparable.
 *
 * Mapping (approximate midpoints):
 *   1 (Good)           →  25
 *   2 (Fair)           →  75
 *   3 (Moderate)       → 125
 *   4 (Poor)           → 200
 *   5 (Very Poor)      → 350
 */

const OW_TO_EPA = {
  1: 25,
  2: 75,
  3: 125,
  4: 200,
  5: 350,
};

/**
 * Convert OpenWeather's 1–5 index to EPA 0–500 scale.
 * Falls back to -1 if the input is outside the expected range.
 */
function owIndexToEpa(owIndex) {
  return OW_TO_EPA[owIndex] ?? -1;
}

/**
 * Clamp any AQI value into the valid EPA range.
 */
function clampAqi(value) {
  return Math.max(0, Math.min(500, Math.round(value)));
}

module.exports = { owIndexToEpa, clampAqi };
