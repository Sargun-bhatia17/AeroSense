/**
 * Air Data Controller
 *
 * Orchestrates the entire data pipeline for a single request:
 *   validate → fetch → fuse → predict → assess risk → respond
 *
 * Each step is delegated to the appropriate service, keeping this
 * controller thin and focused on coordination.
 */

const { validateCoords } = require('../utils/validation');
const aqiService = require('../services/aqiService');
const { fetchWeather } = require('../services/weatherService');
const { fuseAqiData } = require('../services/fusionService');
const { predictAqi } = require('../services/predictionService');
const { assessRisk } = require('../services/riskService');

async function getAirData(req, res) {
  // ── 1. Validate inputs ──
  const coords = validateCoords(req.query);
  if (!coords.valid) {
    return res.status(400).json({ error: coords.error });
  }
  const { lat, lon } = coords;
  const userType = req.query.userType || 'general';

  try {
    // ── 2. Fetch data from all sources in parallel ──
    const [aqiSources, weather] = await Promise.all([
      aqiService.fetchAll(lat, lon),
      fetchWeather(lat, lon),
    ]);

    // ── 3. Fuse AQI data ──
    const fused = fuseAqiData(aqiSources);
    if (!fused) {
      return res.status(502).json({
        error: 'Unable to retrieve air quality data from any source',
        sourcesAttempted: ['openweather', 'waqi'],
      });
    }

    // ── 4. Predict trend ──
    const prediction = predictAqi(fused.value, weather);

    // ── 5. Assess risk ──
    const risk = assessRisk(fused.value, userType);

    // ── 6. Build response ──
    const response = {
      location: { lat, lon },
      aqi: {
        value: fused.value,
        pm25: fused.pm25,
        pm10: fused.pm10,
        confidence: fused.confidence,
        confidenceDetail: fused.confidenceDetail,
        dominantPollutant: fused.dominantPollutant,
        station: fused.stationName,
        sourcesUsed: fused.sourcesUsed,
      },
      weather: weather
        ? {
            temp: weather.temp,
            humidity: weather.humidity,
            windSpeed: weather.windSpeed,
            rain1h: weather.rain1h,
            description: weather.description,
          }
        : null,
      prediction: {
        aqi: prediction.predictedAqi,
        trend: prediction.trend,
        factors: prediction.factors,
      },
      risk: {
        level: risk.level,
        advice: risk.advice,
        userType: risk.userType,
      },
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  } catch (err) {
    console.error('[airDataController] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAirData };
