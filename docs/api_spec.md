# Aerospace AQI Dashboard API Contracts

## Base URL
- Frontend expects backend at `http://localhost:4000/api`

## Shared Response Envelopes
All endpoints should respond with:
- success: boolean
- data: object | array
- meta?: object
- message?: string

Example:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "updatedAt": "2026-03-24T08:00:00.000Z"
  }
}
```

## Core Domain Shapes

### AQI Snapshot
```json
{
  "location": {
    "city": "Pune",
    "locality": "Baner",
    "lat": 18.559,
    "lng": 73.786
  },
  "aqi": 118,
  "category": "Unhealthy for Sensitive Groups",
  "dominantPollutant": "PM2.5",
  "healthScore": 62,
  "trend": "rising",
  "updatedAt": "2026-03-24T08:00:00.000Z",
  "pollutants": [
    { "key": "pm25", "label": "PM2.5", "value": 68, "unit": "µg/m³", "status": "high" },
    { "key": "pm10", "label": "PM10", "value": 112, "unit": "µg/m³", "status": "moderate" },
    { "key": "no2", "label": "NO₂", "value": 28, "unit": "ppb", "status": "moderate" },
    { "key": "o3", "label": "O₃", "value": 19, "unit": "ppb", "status": "low" },
    { "key": "co", "label": "CO", "value": 0.7, "unit": "ppm", "status": "low" }
  ]
}
```

### Forecast Item
```json
{
  "time": "2026-03-24T12:00:00.000Z",
  "aqi": 126,
  "category": "Unhealthy for Sensitive Groups",
  "dominantPollutant": "PM2.5",
  "confidence": 0.84,
  "pollutants": {
    "pm25": 71,
    "pm10": 116,
    "no2": 31,
    "o3": 18,
    "co": 0.8
  }
}
```

### Heatmap Point
```json
{
  "id": "baner-1",
  "name": "Baner High Street",
  "lat": 18.567,
  "lng": 73.776,
  "aqi": 132,
  "intensity": 0.82,
  "category": "Unhealthy for Sensitive Groups",
  "dominantPollutant": "PM2.5"
}
```

### Health Recommendation
```json
{
  "persona": "asthmatic",
  "severity": "high",
  "headline": "Limit outdoor exertion this afternoon",
  "summary": "PM2.5 is elevated and forecast to worsen between 1 PM and 5 PM.",
  "bestWindow": "6:00 AM - 8:00 AM",
  "actions": [
    "Carry your reliever inhaler during commutes.",
    "Prefer indoor exercise after 10 AM.",
    "Keep windows closed in high-traffic areas."
  ],
  "avoidances": [
    "Outdoor running near arterial roads",
    "Midday cycling",
    "Long exposure around construction zones"
  ]
}
```

### Alert Item
```json
{
  "id": "alert-1",
  "severity": "critical",
  "title": "Critical PM2.5 spike predicted",
  "description": "Pollution is expected to cross AQI 175 in Koregaon Park by 4 PM.",
  "time": "2026-03-24T10:00:00.000Z",
  "persona": "general",
  "acknowledged": false
}
```

### Route Analysis
```json
{
  "origin": "Aundh",
  "destination": "Hinjewadi Phase 1",
  "recommendedRouteId": "route-b",
  "routes": [
    {
      "id": "route-a",
      "label": "Fastest route",
      "durationMinutes": 28,
      "distanceKm": 14.2,
      "avgAqi": 139,
      "exposureScore": 74,
      "riskLevel": "high",
      "summary": "Shorter but passes through dense traffic corridors."
    },
    {
      "id": "route-b",
      "label": "Cleanest route",
      "durationMinutes": 34,
      "distanceKm": 15.8,
      "avgAqi": 104,
      "exposureScore": 42,
      "riskLevel": "moderate",
      "summary": "Slightly longer but avoids major hotspots."
    }
  ]
}
```

## Endpoints

### GET /api/pollution/current
Query:
- lat
- lng
- city
- locality

Returns:
- AQI Snapshot

### GET /api/pollution/forecast
Query:
- lat
- lng
- hours (default 24, max 72)

Returns:
- array of Forecast Item

### GET /api/pollution/heatmap
Query:
- city
- pollutant
- timeframe (`now`, `24h`, `48h`, `72h`)

Returns:
- array of Heatmap Point
- meta should include legend scale

### GET /api/pollution/hotspots
Query:
- city

Returns:
- top polluted localities and reasons

### POST /api/health/recommendation
Body:
```json
{
  "persona": "asthmatic",
  "activity": "running",
  "city": "Pune",
  "locality": "Baner"
}
```

Returns:
- Health Recommendation

### GET /api/health/alerts
Query:
- persona
- city

Returns:
- array of Alert Item

### POST /api/ai/best-time
Body:
```json
{
  "persona": "runner",
  "city": "Pune",
  "locality": "Baner",
  "activity": "running"
}
```

Returns:
```json
{
  "bestWindow": "6:00 AM - 8:00 AM",
  "confidence": 0.83,
  "reason": "Lower traffic emissions and favorable wind conditions."
}
```

### POST /api/route/analyze
Body:
```json
{
  "origin": "Aundh",
  "destination": "Hinjewadi Phase 1",
  "persona": "commuter"
}
```

Returns:
- Route Analysis
