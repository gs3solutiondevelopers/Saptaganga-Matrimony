import express from 'express';
import { inquiryController } from '../controllers/inquiryController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', apiLimiter, inquiryController.submitInquiry);
router.get('/', apiLimiter, inquiryController.getAllInquiries);
router.patch('/:id/status', apiLimiter, inquiryController.updateStatus);

export default router;
