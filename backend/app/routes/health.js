import express from 'express';
const router = express.Router();
import healthController from '../controllers/healthController.js';

router.get('/health', healthController.getHealth);

export default router;

