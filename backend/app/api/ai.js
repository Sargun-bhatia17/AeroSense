import express from 'express';
import * as aiService from '../services/ai_service.js';

const router = express.Router();

router.post('/best-time', async (req, res) => {
  const { persona, activity } = req.body;
  try {
    const data = await aiService.getBestTime(persona, activity);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
