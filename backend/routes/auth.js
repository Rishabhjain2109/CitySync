const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
const EnrollmentCredential = require('../models/EnrollmentCredential');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Citizen Signup
router.post('/signup/citizen', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new citizen
    const citizen = new User({
      userType: 'citizen',
      name,
      email,
      password,
      phone,
      address
    });

    await citizen.save();

    // Generate token
    const token = generateToken(citizen._id);

    res.status(201).json({
      message: 'Citizen registered successfully',
      token,
      user: {
        id: citizen._id,
        name: citizen.name,
        email: citizen.email,
        userType: citizen.userType
      }
    });
  } catch (error) {
    console.error('Citizen signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Department Head Signup
router.post('/signup/head', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    // Check if enrollment credential exists and is valid
    const credential = await EnrollmentCredential.findOne({
      enrollmentNumber,
      userType: 'departmentHead',
      isUsed: false
    });

    if (!credential) {
      return res.status(400).json({ message: 'Invalid enrollment number' });
    }

    // Verify password matches the pre-seeded password
    if (password !== credential.password) {
      return res.status(400).json({ message: 'Invalid password for this enrollment number' });
    }

    // Check if user already exists with this enrollment number
    const existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this enrollment number' });
    }

    // Create new department head
    const departmentHead = new User({
      userType: 'departmentHead',
      enrollmentNumber,
      password: credential.password,
      department: credential.department,
      name: credential.name,
      phone: credential.phone,
      address: credential.address
    });

    await departmentHead.save();

    // Mark credential as used
    credential.isUsed = true;
    credential.usedBy = departmentHead._id;
    await credential.save();

    // Generate token
    const token = generateToken(departmentHead._id);

    res.status(201).json({
      message: 'Department head registered successfully',
      token,
      user: {
        id: departmentHead._id,
        name: departmentHead.name,
        userType: departmentHead.userType,
        department: departmentHead.department,
        enrollmentNumber: departmentHead.enrollmentNumber
      }
    });
  } catch (error) {
    console.error('Department head signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Worker Signup
router.post('/signup/worker', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    // Check if enrollment credential exists and is valid
    const credential = await EnrollmentCredential.findOne({
      enrollmentNumber,
      userType: 'worker',
      isUsed: false
    });

    if (!credential) {
      return res.status(400).json({ message: 'Invalid enrollment number' });
    }

    // Verify password matches the pre-seeded password
    if (password !== credential.password) {
      return res.status(400).json({ message: 'Invalid password for this enrollment number' });
    }

    // Check if user already exists with this enrollment number
    const existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this enrollment number' });
    }

    // Find the department head for this department
    const departmentHead = await User.findOne({
      userType: 'departmentHead',
      department: credential.department
    });

    if (!departmentHead) {
      return res.status(400).json({ message: 'No department head found for this department' });
    }

    // Create new worker
    const worker = new User({
      userType: 'worker',
      enrollmentNumber,
      password: credential.password,
      department: credential.department,
      assignedHead: departmentHead._id,
      name: credential.name,
      phone: credential.phone,
      address: credential.address
    });

    await worker.save();

    // Mark credential as used
    credential.isUsed = true;
    credential.usedBy = worker._id;
    await credential.save();

    // Generate token
    const token = generateToken(worker._id);

    res.status(201).json({
      message: 'Worker registered successfully',
      token,
      user: {
        id: worker._id,
        name: worker.name,
        userType: worker.userType,
        department: worker.department,
        assignedHead: worker.assignedHead,
        enrollmentNumber: worker.enrollmentNumber
      }
    });
  } catch (error) {
    console.error('Worker signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { userType, email, enrollmentNumber, password } = req.body;

    let user;

    if (userType === 'citizen') {
      // Citizen login with email and password
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for citizen login' });
      }

      user = await User.findOne({ email, userType: 'citizen' });
    } else if (userType === 'worker' || userType === 'departmentHead') {
      // Worker/Department Head login with enrollment number and password
      if (!enrollmentNumber || !password) {
        return res.status(400).json({ message: 'Enrollment number and password are required for worker/department head login' });
      }

      user = await User.findOne({ enrollmentNumber, userType });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        userType: user.userType,
        email: user.email,
        department: user.department,
        assignedHead: user.assignedHead,
        enrollmentNumber: user.enrollmentNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
