import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'saptaganga_jwt_secret_key_2026';

/**
 * Verify JWT token from HTTP-Only cookie or Authorization Bearer header
 */
export const verifyAuthToken = (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback to Bearer token in Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access. Authentication cookie/token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please log in again.'
    });
  }
};

/**
 * Require Admin role from token
 */
export const verifyAdminRole = (req, res, next) => {
  verifyAuthToken(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Admin authorization required.'
      });
    }
  });
};
