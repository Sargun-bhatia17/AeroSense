/**
 * Health Risk Service
 *
 * Calculates Effective Exposure by applying physiological multipliers
 * to raw AQI and pollutant data. This goes beyond simple AQI thresholds
 * by modelling how different bodies actually absorb airborne toxins:
 *
 *   - Athletes inhale 10–20× more air per minute during exercise
 *   - Elderly individuals face acute cardiovascular stress from SO2
 *   - Children's developing lungs are disproportionately damaged by PM2.5
 *   - Asthmatics face compounding risk when conditions are deteriorating
 *
 * The output is a biologically-adjusted risk assessment, not just a
 * number off a government scale.
 */

// ── Risk tier definitions (ordered for escalation logic) ──
const RISK_TIERS = ['Low', 'Moderate', 'High', 'Critical'];

// ── Effective AQI thresholds for risk classification ──
const RISK_THRESHOLDS = [
  { max: 50, level: 'Low' },
  { max: 100, level: 'Moderate' },
  { max: 150, level: 'High' },
  { max: Infinity, level: 'Critical' },
];

// ── Activity-level ventilation multipliers ──
// Higher physical activity → higher minute ventilation → more pollutant intake
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.25,
  vigorous: 1.5,
};

// ── Base physiological multiplier per user type ──
// Athletes get 1.5× because their baseline ventilation rate during
// training is dramatically higher than the general population.
const USER_TYPE_MULTIPLIERS = {
  athlete: 1.5,
  elderly: 1.0,
  children: 1.0,
  asthmatic: 1.0,
  general: 1.0,
};

// ── Personalised advice templates ──
// Each explains WHY this specific population is at risk.
const ADVICE_TEMPLATES = {
  athlete: {
    Low: 'Air quality is within safe limits. Your elevated breathing rate during exercise poses no additional risk at this level.',
    Moderate: 'Your minute ventilation during training increases pollutant intake by up to 20×. Consider reducing workout intensity or moving indoors.',
    High: 'High effective exposure detected. During vigorous exercise, your lungs process significantly more contaminated air per minute. Switch to indoor training immediately.',
    Critical: 'CRITICAL: At your breathing rate during exercise, pollutant dose is dangerously amplified. All outdoor physical activity must cease. Risk of acute bronchial inflammation and exercise-induced bronchoconstriction.',
  },
  elderly: {
    Low: 'Air quality is acceptable. No additional cardiovascular precautions needed at this time.',
    Moderate: 'Moderate pollutant levels may aggravate pre-existing cardiovascular and respiratory conditions. Limit prolonged outdoor exposure and stay hydrated.',
    High: 'Elevated pollutant concentrations increase risk of cardiac arrhythmia and blood pressure instability. Remain indoors with windows closed.',
    Critical: 'CRITICAL: Extreme air quality hazard for cardiovascular health. Risk of acute cardiac events, stroke, and severe respiratory distress. Stay indoors with air purification. Seek medical attention for any chest pain or breathing difficulty.',
  },
  children: {
    Low: 'Air quality is safe for outdoor play and school activities.',
    Moderate: 'Developing lungs are more susceptible to pollutant damage. Reduce prolonged outdoor play and monitor for coughing or wheezing.',
    High: 'Children\'s smaller airways and higher breathing rates per body weight increase pollutant dose. Keep indoors and avoid playgrounds.',
    Critical: 'CRITICAL: Severe risk to developing respiratory systems. Prolonged exposure at this level is associated with irreversible reduction in lung function. Children must remain indoors in a filtered environment.',
  },
  asthmatic: {
    Low: 'Air quality is manageable. Carry your rescue inhaler as a standard precaution.',
    Moderate: 'Airway hyperresponsiveness may be triggered at this pollutant level. Limit outdoor exertion and keep rescue medication accessible.',
    High: 'Significant risk of acute asthma exacerbation. Pollutant-induced bronchospasm is likely with prolonged exposure. Avoid outdoor activity entirely.',
    Critical: 'CRITICAL: Extreme risk of severe asthma attack. Inflammatory mediators in the airway are maximally stimulated at this exposure level. Remain indoors, use preventive medication, and seek emergency care if symptoms escalate.',
  },
  general: {
    Low: 'Air quality is good. No health precautions needed.',
    Moderate: 'Some pollutant exposure detected. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
    High: 'Elevated air pollution may cause respiratory irritation even in healthy individuals. Limit outdoor exposure time.',
    Critical: 'CRITICAL: Hazardous air quality. All individuals are at risk of acute respiratory and cardiovascular effects. Stay indoors with air purification.',
  },
};

// ── Core assessment function ──

/**
 * Calculate biologically-adjusted health risk from fused air quality data.
 *
 * @param {object} fusedData
 * @param {number} fusedData.aqi              - raw fused AQI (0–500 EPA scale)
 * @param {number|null} fusedData.pm25        - PM2.5 concentration (µg/m³)
 * @param {number|null} fusedData.so2         - Sulfur Dioxide concentration (µg/m³)
 * @param {number|null} fusedData.no2         - Nitrogen Dioxide concentration (µg/m³)
 * @param {string|null} fusedData.dominantPollutant
 *
 * @param {object} userProfile
 * @param {string} userProfile.userType       - athlete | elderly | children | asthmatic | general
 * @param {string} userProfile.activityLevel  - sedentary | light | moderate | vigorous
 *
 * @param {string} [trend='Stable']           - Improving | Stable | Worsening
 *
 * @returns {{ effectiveAQI: number, riskLevel: string, personalizedAdvice: string, warnings: string[] }}
 */
function assessHealthRisk(fusedData, userProfile, trend = 'Stable') {
  const { aqi, pm25, so2 } = fusedData;
  const userType = (userProfile.userType || 'general').toLowerCase();
  const activityLevel = (userProfile.activityLevel || 'moderate').toLowerCase();

  const warnings = [];

  // ── 1. Calculate effective AQI with physiological multipliers ──
  const baseMultiplier = USER_TYPE_MULTIPLIERS[userType] ?? 1.0;
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.0;
  const effectiveAQI = Math.round(aqi * baseMultiplier * activityMultiplier);

  // ── 2. Determine base risk level from effective AQI ──
  let riskLevel = classifyRisk(effectiveAQI);

  // ── 3. Apply population-specific pollutant rules ──

  // Elderly / Industrial SO2 Rule:
  // SO2 > 20 µg/m³ triggers acute cardiovascular stress in elderly populations
  if (userType === 'elderly' && so2 != null && so2 > 20) {
    warnings.push(
      `HIGH-PRIORITY: Sulfur Dioxide at ${so2} µg/m³ exceeds the 20 µg/m³ safe threshold for elderly individuals. ` +
      'SO2 from industrial emissions causes acute cardiovascular stress — vasoconstriction, ' +
      'elevated blood pressure, and increased risk of cardiac events.'
    );
    riskLevel = escalateToMinimum(riskLevel, 'High');
  }

  // Pediatric PM2.5 Rule:
  // PM2.5 > 35 µg/m³ is associated with impaired lung development in children
  if (userType === 'children' && pm25 != null && pm25 > 35) {
    warnings.push(
      `WARNING: PM2.5 at ${pm25} µg/m³ exceeds the 35 µg/m³ pediatric safety threshold. ` +
      'Chronic exposure at this level is linked to stunted lung development, reduced FEV1 growth, ' +
      'and increased lifetime risk of respiratory disease.'
    );
    riskLevel = escalateToMinimum(riskLevel, 'High');
  }

  // ── 4. Trend integration for asthmatics ──
  // Worsening conditions compound asthmatic risk due to delayed inflammatory response
  if (userType === 'asthmatic' && trend === 'Worsening') {
    warnings.push(
      'Air quality trend is WORSENING. Asthmatic individuals face compounding risk — ' +
      'airway inflammation accumulates faster than pollutant levels rise. Risk escalated by one tier.'
    );
    riskLevel = escalateByOne(riskLevel);
  }

  // ── 5. Build personalised advice ──
  const advicePool = ADVICE_TEMPLATES[userType] || ADVICE_TEMPLATES.general;
  let personalizedAdvice = advicePool[riskLevel];

  // Append any triggered warnings to the advice
  if (warnings.length > 0) {
    personalizedAdvice += ' ' + warnings.join(' ');
  }

  return {
    effectiveAQI,
    riskLevel,
    personalizedAdvice,
    warnings,
  };
}

// ── Helper: classify risk from effective AQI ──

function classifyRisk(effectiveAQI) {
  for (const { max, level } of RISK_THRESHOLDS) {
    if (effectiveAQI <= max) return level;
  }
  return 'Critical';
}

// ── Helper: escalate risk to at least a given minimum tier ──

function escalateToMinimum(currentLevel, minimumLevel) {
  const currentIdx = RISK_TIERS.indexOf(currentLevel);
  const minimumIdx = RISK_TIERS.indexOf(minimumLevel);
  return currentIdx >= minimumIdx ? currentLevel : minimumLevel;
}

// ── Helper: escalate risk by exactly one tier ──

function escalateByOne(currentLevel) {
  const idx = RISK_TIERS.indexOf(currentLevel);
  const nextIdx = Math.min(idx + 1, RISK_TIERS.length - 1);
  return RISK_TIERS[nextIdx];
}

module.exports = { assessHealthRisk };
