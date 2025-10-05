const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


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


// for user submitting complaints
router.post('/userSubmit', auth, upload.array('images'), async (req, res) => {
  try {
    const { description, address } = req.body;
    const user = req.user; // from auth middleware

    // Upload each image to Cloudinary
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'complaints',
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(file.path); // Delete local temp file
    }

    // Create new complaint document
    const newComplaint = new Complaint({
      user: user._id,
      department: user.department,
      description,
      address,
      images: uploadedImages,
      status: 'Pending',
      createdAt: new Date()
    });

    await newComplaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint: newComplaint
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting complaint', error: error.message });
  }
});


module.exports = router;
