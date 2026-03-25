import express from 'express';
import * as routeService from '../services/route_service.js';

const router = express.Router();

router.post('/analyze', (req, res) => {
  const { origin, destination, persona } = req.body;
  const data = routeService.analyzeRoute(origin, destination, persona);
  res.json({ data });
});

export default router;
