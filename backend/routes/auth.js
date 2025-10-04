const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
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
    const { enrollmentNumber, password, name, phone, address } = req.body;

    // Check if enrollment number exists in any department
    const department = await Department.findOne({
      headEnrollmentNumbers: enrollmentNumber
    });

    if (!department) {
      return res.status(400).json({ message: 'Invalid enrollment number' });
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
      password,
      department: department.name,
      name,
      phone,
      address
    });

    await departmentHead.save();

    // Generate token
    const token = generateToken(departmentHead._id);

    res.status(201).json({
      message: 'Department head registered successfully',
      token,
      user: {
        id: departmentHead._id,
        name: departmentHead.name,
        email: departmentHead.email,
        userType: departmentHead.userType,
        department: departmentHead.department
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
    const { enrollmentNumber, password, name, phone, address } = req.body;

    // Check if enrollment number exists in any department
    const department = await Department.findOne({
      workerEnrollmentNumbers: enrollmentNumber
    });

    if (!department) {
      return res.status(400).json({ message: 'Invalid enrollment number' });
    }

    // Check if user already exists with this enrollment number
    const existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this enrollment number' });
    }

    // Find the department head for this department
    const departmentHead = await User.findOne({
      userType: 'departmentHead',
      department: department.name
    });

    if (!departmentHead) {
      return res.status(400).json({ message: 'No department head found for this department' });
    }

    // Create new worker
    const worker = new User({
      userType: 'worker',
      enrollmentNumber,
      password,
      department: department.name,
      assignedHead: departmentHead._id,
      name,
      phone,
      address
    });

    await worker.save();

    // Generate token
    const token = generateToken(worker._id);

    res.status(201).json({
      message: 'Worker registered successfully',
      token,
      user: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        userType: worker.userType,
        department: worker.department,
        assignedHead: worker.assignedHead
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
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
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
        email: user.email,
        userType: user.userType,
        department: user.department,
        assignedHead: user.assignedHead
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
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
