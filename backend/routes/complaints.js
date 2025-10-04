const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

router.get('/department', auth, async (req, res) => {
  try {
    const head = req.user;

    if (head.userType !== 'departmentHead') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const complaints = await Complaint.find({ department: head.department });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
