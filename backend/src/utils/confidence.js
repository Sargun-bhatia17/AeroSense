/**
 * Confidence Score Calculator
 *
 * Measures how much we can trust the fused AQI value by looking at
 * agreement between the two data sources.
 *
 * Logic:
 *   - If both sources agree closely (diff ≤ 20)  → HIGH confidence
 *   - Moderate disagreement (diff ≤ 60)           → MEDIUM
 *   - Large disagreement (diff > 60)              → LOW
 *   - Only one source available                   → LOW (single-source)
 */

/**
 * @param {number|null} aqiA  - EPA-normalised AQI from source A
 * @param {number|null} aqiB  - EPA-normalised AQI from source B
 * @returns {{ score: string, detail: string }}
 */
function calculateConfidence(aqiA, aqiB) {
  // Only one source available
  if (aqiA == null || aqiB == null) {
    return { score: 'LOW', detail: 'Single data source available' };
  }

  const diff = Math.abs(aqiA - aqiB);

  if (diff <= 20) {
    return { score: 'HIGH', detail: `Sources agree within ${diff} points` };
  }
  if (diff <= 60) {
    return { score: 'MEDIUM', detail: `Sources differ by ${diff} points` };
  }
  return { score: 'LOW', detail: `Sources diverge by ${diff} points` };
}

module.exports = { calculateConfidence };
