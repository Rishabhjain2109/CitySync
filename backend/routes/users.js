const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get workers under a department head
router.get('/workers', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'departmentHead') {
      return res.status(403).json({ message: 'Access denied. Only department heads can view workers.' });
    }

    const workers = await User.find({
      userType: 'worker',
      assignedHead: req.user._id
    }).select('-password');

    res.json({
      message: 'Workers retrieved successfully',
      workers,
      count: workers.length
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get department head's department info
router.get('/department-info', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'departmentHead') {
      return res.status(403).json({ message: 'Access denied. Only department heads can view department info.' });
    }

    const departmentHead = await User.findById(req.user._id).select('-password');
    
    res.json({
      message: 'Department info retrieved successfully',
      department: departmentHead.department,
      headName: departmentHead.name,
      enrollmentNumber: departmentHead.enrollmentNumber
    });
  } catch (error) {
    console.error('Get department info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get worker's assigned head info
router.get('/assigned-head', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'worker') {
      return res.status(403).json({ message: 'Access denied. Only workers can view assigned head info.' });
    }

    const assignedHead = await User.findById(req.user.assignedHead).select('-password');
    
    res.json({
      message: 'Assigned head info retrieved successfully',
      assignedHead: {
        id: assignedHead._id,
        name: assignedHead.name,
        department: assignedHead.department,
        enrollmentNumber: assignedHead.enrollmentNumber
      }
    });
  } catch (error) {
    console.error('Get assigned head error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
