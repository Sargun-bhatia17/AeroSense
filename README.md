# Hyperlocal Air Quality Intelligence System

A sophisticated data fusion and decision intelligence backend for hyper-local air quality monitoring, prediction, and health risk assessment.

## Overview

Unlike standard CRUD applications, this backend acts as an intelligence engine. It fetches data from multiple external sources (OpenWeather Air Pollution API, WAQI, OpenWeather current weather), normalizes scales, fuses the data for optimal accuracy, predicts short-term trends based on meteorological conditions, and calculates personalized health risks.

## Tech Stack
- **Node.js**
- **Express.js**
- **Axios** (for external API fetching)
- **Dotenv** (for configuration)

## Architecture & Flow

The backend follows a clean, service-oriented architecture:

`GET /api/air-data?lat={lat}&lon={lon}&userType={optional}`

1. **Validation (`utils/validation.js`)**: Validates the input coordinates and user type.
2. **Data Fetching (`services/aqiService.js`, `services/weatherService.js`)**:
   - Calls OpenWeather and WAQI APIs in parallel for AQI data.
   - Calls OpenWeather for weather data (wind, temperature, humidity, rain).
3. **Data Fusion (`services/fusionService.js`)**:
   - Normalizes OpenWeather's 1-5 scale to the EPA 0-500 scale.
   - Calculates a weighted average (favoring WAQI as it's station-calibrated).
   - Resolves conflicts by conservatively picking the worst-case particulate matter values.
   - Assigns a confidence score based on the agreement between data sources.
4. **Prediction (`services/predictionService.js`)**:
   - Analyzes real-time weather conditions to heuristically predict short-term AQI trends (e.g., strong winds disperse pollutants; rain causes particle washout; high humidity and low winds cause stagnation).
5. **Risk Assessment (`services/riskService.js`)**:
   - Calculates a personalized risk level and health advice based on the fused AQI and the `userType` (e.g., `asthmatic`, `runner`, `elderly`, `child`, `general`).
6. **Response Generation (`controllers/airDataController.js`)**:
   - Structures the generated insights into a clean JSON response for the frontend.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Ensure you have a `.env` file inside the `backend` directory with valid API keys:
   ```env
   PORT=3001
   OPENWEATHER_API_KEY=your_openweather_key
   WAQI_TOKEN=your_waqi_token
   ```

### Running the Server

Start the server in development mode:
```bash
npm run dev
```

Or start for production:
```bash
npm start
```

The server will be available at `http://localhost:3001`.

## API Endpoint

### `GET /api/air-data`

**Query Parameters:**
- `lat` (required): Latitude of the location.
- `lon` (required): Longitude of the location.
- `userType` (optional): The health profile of the user. Options: `general` (default), `asthmatic`, `runner`, `elderly`, `child`.

**Example Request:**
```bash
curl "http://localhost:3001/api/air-data?lat=28.6139&lon=77.2090&userType=asthmatic"
```
