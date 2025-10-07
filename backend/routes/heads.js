const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/workers', auth, async (req, res) => {
  try {
    const head = req.user;
    if (head.userType !== 'departmentHead') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const workers = await User.find({ department: head.department, userType: 'worker' });
    res.json({ count: workers.length, workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
