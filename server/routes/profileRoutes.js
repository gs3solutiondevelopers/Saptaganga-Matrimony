import express from 'express';
import multer from 'multer';
import { profileController } from '../controllers/profileController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { profileRegistrationSchema } from '../validators/profileValidator.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Candidate Profile routes with Zod validation
router.get('/', apiLimiter, profileController.getAllProfiles);
router.get('/:id', apiLimiter, profileController.getProfileById);
router.post('/register', apiLimiter, validateBody(profileRegistrationSchema), profileController.createProfile);
router.post('/', apiLimiter, validateBody(profileRegistrationSchema), profileController.createProfile);
router.put('/:id', apiLimiter, validateBody(profileRegistrationSchema), profileController.updateProfile);
router.delete('/:id', apiLimiter, profileController.deleteProfile);
router.patch('/:id/verify', apiLimiter, profileController.toggleVerification);
router.post('/upload-photo', apiLimiter, upload.single('photo'), profileController.uploadPhoto);

export default router;
