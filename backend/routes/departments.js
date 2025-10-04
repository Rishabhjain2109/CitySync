const express = require('express');
const Department = require('../models/Department');

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.json({
      message: 'Departments retrieved successfully',
      departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department (for initial setup)
router.post('/', async (req, res) => {
  try {
    const { name, displayName, description, headEnrollmentNumbers, workerEnrollmentNumbers } = req.body;

    const department = new Department({
      name,
      displayName,
      description,
      headEnrollmentNumbers,
      workerEnrollmentNumbers
    });

    await department.save();

    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
