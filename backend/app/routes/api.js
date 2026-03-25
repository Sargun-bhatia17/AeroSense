import express from 'express';
const router = express.Router();
import apiController from '../controllers/apiController.js';

// Main Intelligence Feed
router.get('/latest', apiController.getLatestData);

// Historical & Projections
router.get('/history', apiController.getHistory);
router.get('/forecast', apiController.getForecast);

// Network & Geo
router.get('/sectors', apiController.getSectors);
router.get('/nodes', apiController.getNodes);

// User Profile
router.get('/profile/:id', apiController.getProfile);
router.post('/profile', apiController.upsertProfile);

export default router;

