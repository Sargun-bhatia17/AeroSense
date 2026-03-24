/**
 * Risk Service
 *
 * Determines personalised health risk based on:
 *   1. Current AQI level
 *   2. User type (general public, asthmatic, runner, elderly, child)
 *
 * Risk matrix is intentionally conservative — for health-sensitive apps,
 * it's better to over-warn than under-warn.
 */

// ── Risk thresholds per user type ──
// Each entry: [maxAqi, riskLevel, advice]
// Evaluated in order; first match wins.
const RISK_MATRIX = {
  asthmatic: [
    [50, 'LOW', 'Air quality is acceptable. Carry your inhaler as a precaution.'],
    [100, 'MODERATE', 'Sensitive individuals may experience symptoms. Limit prolonged outdoor exertion.'],
    [150, 'HIGH', 'Avoid outdoor activity. Keep rescue medication accessible.'],
    [Infinity, 'SEVERE', 'Stay indoors with air purification. Seek medical attention if symptoms worsen.'],
  ],
  runner: [
    [50, 'LOW', 'Great conditions for outdoor exercise.'],
    [100, 'MODERATE', 'Consider reducing intensity of outdoor workouts.'],
    [120, 'HIGH', 'Avoid outdoor exercise. Use indoor alternatives.'],
    [Infinity, 'SEVERE', 'Do not exercise outdoors. Air quality is hazardous.'],
  ],
  elderly: [
    [50, 'LOW', 'Air quality is good. Enjoy outdoor activities.'],
    [100, 'MODERATE', 'Limit prolonged outdoor exposure. Stay hydrated.'],
    [130, 'HIGH', 'Stay indoors. Keep windows closed.'],
    [Infinity, 'SEVERE', 'Remain indoors with air purification. Monitor health closely.'],
  ],
  child: [
    [50, 'LOW', 'Safe for outdoor play.'],
    [80, 'MODERATE', 'Reduce prolonged outdoor play. Watch for coughing or fatigue.'],
    [120, 'HIGH', 'Keep children indoors. Avoid playgrounds.'],
    [Infinity, 'SEVERE', 'Children must stay indoors. Close all windows.'],
  ],
  general: [
    [50, 'LOW', 'Air quality is good. No precautions needed.'],
    [100, 'MODERATE', 'Unusually sensitive individuals should consider limiting outdoor exertion.'],
    [150, 'HIGH', 'Everyone may begin to experience health effects. Limit outdoor time.'],
    [200, 'VERY HIGH', 'Health alert: significant risk. Avoid prolonged outdoor exposure.'],
    [Infinity, 'SEVERE', 'Emergency conditions. Remain indoors.'],
  ],
};

/**
 * @param {number} aqi
 * @param {string} [userType='general']
 * @returns {{ level, advice, userType }}
 */
function assessRisk(aqi, userType = 'general') {
  const type = userType.toLowerCase();
  const matrix = RISK_MATRIX[type] || RISK_MATRIX.general;

  for (const [threshold, level, advice] of matrix) {
    if (aqi <= threshold) {
      return { level, advice, userType: type };
    }
  }

  // Fallback (should never reach here due to Infinity sentinel)
  return { level: 'UNKNOWN', advice: 'Unable to determine risk.', userType: type };
}

module.exports = { assessRisk };
