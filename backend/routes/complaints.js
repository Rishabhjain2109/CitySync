const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // max 5 files
  }
});


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
    const { description, address, type } = req.body;
    const user = req.user;
    const files = Array.isArray(req.files) ? req.files : [];

    if (!description || !address || !type) {
      return res.status(400).json({ message: 'description, address and type are required' });
    }

    // Upload all images to Cloudinary in parallel (fail-fast with lower timeout)
    let uploadedImages = [];
    if (files.length > 0) {
      const uploadPromises = files.map(file => {
        return cloudinary.uploader
          .upload(file.path, { folder: 'complaints', timeout: 10000, resource_type: 'image' })
          .then(result => {
            try { fs.unlinkSync(file.path); } catch (_) {}
            return result.secure_url;
          })
          .catch(err => {
            try { fs.unlinkSync(file.path); } catch (_) {}
            throw err;
          });
      });

      uploadedImages = await Promise.all(uploadPromises);
    }


    const newComplaint = new Complaint({
      citizen: user._id,
      department: type,
      description,
      location: address,
      images: uploadedImages,
      status: 'pending',
      createdAt: new Date()
    });
    

    await newComplaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint: newComplaint,
    });
  } catch (error) {
    console.error('Error in /userSubmit:', error);
    const isTimeout = /timed out|Timeout/i.test(error?.message || '');
    res.status(isTimeout ? 504 : 500).json({ message: isTimeout ? 'Upload to Cloudinary timed out' : 'Error submitting complaint', error: error.message });
  }
});



module.exports = router;
