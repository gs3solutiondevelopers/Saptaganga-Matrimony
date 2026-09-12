import jwt from 'jsonwebtoken';
import { adminService } from '../services/adminService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'saptaganga_jwt_secret_key_2026';

export const adminController = {
  // POST /api/admin/login
  async login(req, res, next) {
    try {
      const { email, password, pin } = req.body;
      const result = adminService.verifyAdmin(email, password, pin);
      if (!result.success) {
        return res.status(401).json(result);
      }

      // Generate JWT Auth Token
      const token = jwt.sign(
        { 
          id: result.session.adminId, 
          email: result.session.email, 
          name: result.session.name,
          role: 'admin' 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-Only Security Cookie
      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript XSS theft
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(200).json({
        success: true,
        user: result.session,
        message: 'Admin authentication successful. HTTP-Only cookie set.'
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/admin/logout
  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.status(200).json({
      success: true,
      message: 'Admin logged out successfully. Session cookie cleared.'
    });
  },

  // GET /api/admin/me
  async getMe(req, res) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    return res.status(200).json({
      success: true,
      user: {
        adminId: req.user.id,
        email: req.user.email,
        name: req.user.name || 'Super Admin',
        role: req.user.role
      }
    });
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
