/**
 * Server entry point
 *
 * Boots Express with CORS and JSON parsing, mounts routes,
 * and starts listening.
 */

const express = require('express');
const cors = require('cors');
const { PORT } = require('./src/config/env');
const airDataRoutes = require('./src/routes/airDataRoutes');

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.use('/api', airDataRoutes);

// ── Health check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n🌍  Hyperlocal AQI Intelligence server running on http://localhost:${PORT}`);
  console.log(`    → GET /api/air-data?lat=28.6139&lon=77.2090&userType=asthmatic\n`);
});
