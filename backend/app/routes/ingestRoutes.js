/**
 * AERIS Backend — Sensor Ingestion Route
 * ────────────────────────────────────────────────────────────────
 * POST /api/v1/ingest
 *
 * Protected by X-API-KEY header (not JWT).
 * Receives environmental telemetry from ESP32 edge nodes.
 */

import express from 'express';
import { verifyApiKey } from '../middleware/apiKeyMiddleware.js';
import { ingestData } from '../controllers/ingestController.js';

const router = express.Router();

// POST /api/v1/ingest — ESP32 sensor data ingestion
router.post('/', verifyApiKey, ingestData);

export default router;

