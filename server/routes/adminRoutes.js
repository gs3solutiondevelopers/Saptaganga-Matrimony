import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import { verifyAdminRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Admin Auth Endpoints
router.post('/login', authLimiter, adminController.login);
router.post('/logout', adminController.logout);

// Protected Admin Endpoints (Require HTTP-Only Cookie Verification)
router.get('/me', verifyAdminRole, adminController.getMe);
router.get('/stats', apiLimiter, verifyAdminRole, adminController.getDashboardStats);
router.patch('/profiles/:id/approve', apiLimiter, verifyAdminRole, adminController.approveProfile);

export default router;
