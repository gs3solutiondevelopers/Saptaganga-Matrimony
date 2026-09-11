import { adminService } from '../services/adminService.js';

export const adminController = {
  // POST /api/admin/login
  async login(req, res, next) {
    try {
      const { email, password, pin } = req.body;
      const result = adminService.verifyAdmin(email, password, pin);
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/stats
  async getDashboardStats(req, res, next) {
    try {
      const result = await adminService.getDashboardStats();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/admin/profiles/:id/approve
  async approveProfile(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.approveProfile(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
