import express from 'express';
import * as pollutionService from '../services/pollution_service.js';

const router = express.Router();

router.get('/current', (req, res) => {
  const data = pollutionService.getCurrentAqi();
  res.json({ data });
});

router.get('/forecast', (req, res) => {
  const data = pollutionService.getForecast();
  res.json({ data });
});

router.get('/heatmap', (req, res) => {
  const data = pollutionService.getHeatmapData();
  res.json({ data });
});

router.get('/hotspots', (req, res) => {
  const data = pollutionService.getHotspots();
  res.json({ data });
});

export default router;

