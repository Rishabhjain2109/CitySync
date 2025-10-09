// backend/middleware/adminAuth.js
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.admin = { isAdmin: true }; // optional
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuth;
