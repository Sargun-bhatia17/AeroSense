import express from 'express';
import * as healthService from '../services/health_service.js';

const router = express.Router();

router.post('/recommendation', (req, res) => {
  const { persona } = req.body;
  const data = healthService.getRecommendation(persona);
  res.json({ data });
});

export default router;
