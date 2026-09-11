import express from 'express';
import multer from 'multer';
import { profileController } from '../controllers/profileController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Profile routes
router.get('/', apiLimiter, profileController.getAllProfiles);
router.get('/:id', apiLimiter, profileController.getProfileById);
router.post('/', apiLimiter, profileController.createProfile);
router.put('/:id', apiLimiter, profileController.updateProfile);
router.delete('/:id', apiLimiter, profileController.deleteProfile);
router.patch('/:id/verify', apiLimiter, profileController.toggleVerification);
router.post('/upload-photo', apiLimiter, upload.single('photo'), profileController.uploadPhoto);

export default router;
