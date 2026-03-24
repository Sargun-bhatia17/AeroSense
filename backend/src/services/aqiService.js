/**
 * AQI Service
 *
 * Fetches raw air quality data from two independent sources:
 *   1. OpenWeather Air Pollution API  (component-level PM2.5, PM10, etc.)
 *   2. WAQI (World Air Quality Index) (pre-computed EPA-scale AQI)
 *
 * Each fetcher returns a normalised shape or null on failure,
 * so the fusion layer can work with whichever sources responded.
 */

const axios = require('axios');
const { OPENWEATHER_API_KEY, WAQI_TOKEN } = require('../config/env');
const { owIndexToEpa } = require('../utils/aqiConverter');

// ───────────────────── OpenWeather ─────────────────────

async function fetchOpenWeather(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution`;
    const { data } = await axios.get(url, {
      params: { lat, lon, appid: OPENWEATHER_API_KEY },
      timeout: 8000,
    });

    const item = data.list?.[0];
    if (!item) return null;

    const components = item.components; // { pm2_5, pm10, no2, o3, ... }
    const owIndex = item.main?.aqi;     // 1–5 scale

    return {
      source: 'openweather',
      aqiEpa: owIndexToEpa(owIndex),     // normalised to 0–500
      owIndex,
      pm25: components.pm2_5 ?? null,
      pm10: components.pm10 ?? null,
      no2: components.no2 ?? null,
      o3: components.o3 ?? null,
      so2: components.so2 ?? null,
      co: components.co ?? null,
    };
  } catch (err) {
    console.error('[aqiService] OpenWeather fetch failed:', err.message);
    return null;
  }
}

// ───────────────────── WAQI ─────────────────────

async function fetchWAQI(lat, lon) {
  try {
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/`;
    const { data } = await axios.get(url, {
      params: { token: WAQI_TOKEN },
      timeout: 8000,
    });

    if (data.status !== 'ok' || !data.data) return null;

    const d = data.data;

    return {
      source: 'waqi',
      aqiEpa: d.aqi ?? null,              // already EPA scale
      pm25: d.iaqi?.pm25?.v ?? null,
      pm10: d.iaqi?.pm10?.v ?? null,
      no2: d.iaqi?.no2?.v ?? null,
      o3: d.iaqi?.o3?.v ?? null,
      dominantPollutant: d.dominentpol ?? null,
      stationName: d.city?.name ?? null,
    };
  } catch (err) {
    console.error('[aqiService] WAQI fetch failed:', err.message);
    return null;
  }
}

// ───────────────────── Public API ─────────────────────

/**
 * Fetch AQI data from all sources in parallel.
 * Returns an array of results (nulls filtered out).
 */
async function fetchAll(lat, lon) {
  const results = await Promise.all([
    fetchOpenWeather(lat, lon),
    fetchWAQI(lat, lon),
  ]);
  return results.filter(Boolean);
}

module.exports = { fetchAll };
