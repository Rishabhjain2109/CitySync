const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your User model
const auth = require('../middleware/auth'); // Your auth middleware

// GET /api/workers/my-head
router.get('/my-head', auth, async (req, res) => {
  try {
    const workerId = req.user._id;

    // Find the worker and populate the assigned head
    const worker = await User.findById(workerId).populate('assignedHead');

    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    if (!worker.assignedHead) return res.status(404).json({ message: 'No head assigned' });

    res.json({
      head: {
        id: worker.assignedHead._id,
        name: worker.assignedHead.name,
        enrollmentNumber: worker.assignedHead.enrollmentNumber,
        phone: worker.assignedHead.phone,
        department: worker.assignedHead.department,
        address: worker.assignedHead.address,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
