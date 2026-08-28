const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resolveflow_super_secret_jwt_key_hackathon_2026');

      if (decoded) {
        req.user = decoded;
        return next();
      }
    } catch (error) {
      console.warn('Auth Token Verification Failed:', error.message);
      return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
    }
  }

  // Fallback demo user token verification or development fallback token payload
  if (!token) {
    if (process.env.NODE_ENV !== 'production' || req.headers['x-demo-user'] === 'true') {
      req.user = { id: 'demo-user-123', name: 'Alex Rivera (Admin)', role: 'ADMIN', companyId: 'COMP-DEFAULT' };
      return next();
    }
    return res.status(401).json({ error: 'Not authorized, authorization token missing' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied: Role '${req.user ? req.user.role : 'GUEST'}' is not authorized to perform this operation` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
