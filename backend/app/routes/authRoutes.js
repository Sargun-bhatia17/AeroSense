import express from 'express';
import { register, login, me, updateAccount } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me (Protected route example)
router.get('/me', verifyToken, me);

// PUT /api/v1/auth/update
router.put('/update', verifyToken, updateAccount);

export default router;

