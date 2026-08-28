const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resolveflow_super_secret_jwt_key_hackathon_2026');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback user context for dev/demo if token contains decoded id
        req.user = { id: decoded.id, name: 'Hackathon Operator', role: decoded.role || 'ADMIN' };
      }
      return next();
    } catch (error) {
      console.warn('Auth Token Verification Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  // Fallback demo user for hackathon evaluation if authorization header omitted
  req.user = { id: 'demo-user-123', name: 'Rahul Sharma (Demo)', role: 'ADMIN', companyId: 'COMP-DEFAULT' };
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `User role ${req.user ? req.user.role : 'none'} is not authorized for this action` });
    }
    next();
  };
};

module.exports = { protect, authorize };
