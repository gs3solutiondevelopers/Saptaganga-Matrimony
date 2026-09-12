import { profileService } from '../services/profileService.js';

export const profileController = {
  // GET /api/profiles
  async getAllProfiles(req, res, next) {
    try {
      const filters = {
        gender: req.query.gender,
        religion: req.query.religion,
        category: req.query.category,
        minAge: req.query.minAge,
        maxAge: req.query.maxAge
      };
      const result = await profileService.getAllProfiles(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/profiles/:id
  async getProfileById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await profileService.getProfileById(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/profiles
  async createProfile(req, res, next) {
    try {
      const profileData = req.body;
      if (!profileData.name && !profileData.fullName) {
        return res.status(400).json({ success: false, error: 'Name is required' });
      }
      const result = await profileService.createProfile(profileData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/profiles/:id
  async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await profileService.updateProfile(id, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/profiles/:id
  async deleteProfile(req, res, next) {
    try {
      const { id } = req.params;
      const result = await profileService.deleteProfile(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/profiles/:id/verify
  async toggleVerification(req, res, next) {
    try {
      const { id } = req.params;
      const { currentStatus } = req.body;
      const result = await profileService.toggleVerification(id, currentStatus);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/profiles/upload-photo
  async uploadPhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file provided' });
      }
      const result = await profileService.uploadPhotoToStorage(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
