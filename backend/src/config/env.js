/**
 * Centralised environment config.
 * Validates that required keys exist at startup so we fail fast.
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['OPENWEATHER_API_KEY', 'WAQI_TOKEN'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  WAQI_TOKEN: process.env.WAQI_TOKEN,
};
