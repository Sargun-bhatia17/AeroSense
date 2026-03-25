import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/profile (Protected Route)
router.get('/', verifyToken, getProfile);

// PUT /api/v1/profile (Protected Route)
router.put('/', verifyToken, updateProfile);

export default router;

