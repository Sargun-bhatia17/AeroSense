/**
 * Weather Service
 *
 * Fetches current weather conditions that directly affect air quality:
 *   - Wind speed & direction  (dispersion)
 *   - Humidity                (particle settling)
 *   - Temperature             (inversion layers)
 *   - Rain                    (washout effect)
 *   - Weather description     (general context)
 */

const axios = require('axios');
const { OPENWEATHER_API_KEY } = require('../config/env');

/**
 * @returns {{ windSpeed, windDeg, humidity, temp, rain1h, description } | null}
 */
async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const { data } = await axios.get(url, {
      params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' },
      timeout: 8000,
    });

    return {
      windSpeed: data.wind?.speed ?? 0,       // m/s
      windDeg: data.wind?.deg ?? 0,
      humidity: data.main?.humidity ?? 0,       // %
      temp: data.main?.temp ?? 0,              // °C
      rain1h: data.rain?.['1h'] ?? 0,          // mm in last hour
      description: data.weather?.[0]?.description ?? '',
    };
  } catch (err) {
    console.error('[weatherService] Fetch failed:', err.message);
    return null;
  }
}

module.exports = { fetchWeather };
