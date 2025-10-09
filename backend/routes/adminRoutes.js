// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const Complaint = require('../models/Complaint');

// Fixed admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@citysync.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // simple JWT for admin
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Get all complaints (admin-only)
router.get('/complaints', auth, async (req, res) => {
  try {
    // Only allow admin access
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const complaints = await Complaint.find()
    .populate({
      path: 'assignedWorkers',
      populate: { path: 'assignedHead', select: 'name' } // nested populate to get the head of each worker
    })
    .populate('citizen', 'name email'); // populate citizen info if needed
  
    res.json({ complaints });
  } catch (err) {
    console.error('Admin complaints error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
