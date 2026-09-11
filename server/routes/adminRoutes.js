import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, adminController.login);
router.get('/stats', apiLimiter, adminController.getDashboardStats);
router.patch('/profiles/:id/approve', apiLimiter, adminController.approveProfile);

export default router;
