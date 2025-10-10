const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your User model
const auth = require('../middleware/auth'); // Your auth middleware
const Complaint = require('../models/Complaint');
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

router.get('/get-workers', auth, async (req, res) => {
  try {
    const workers = await User.find({ userType: 'worker', department: req.user.department });
    res.json({ workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-worker', auth, async (req, res) => {
  try {
    const { workerId, status, allocatedComplaint } = req.body;

    // Support both single ID and array of IDs
    if (Array.isArray(workerId)) {
      const result = await User.updateMany(
        { _id: { $in: workerId } },
        { $set: { status, allocatedComplaint } }
      );
      return res.json({
        message: 'Workers updated successfully',
        matchedCount: result.matchedCount ?? result.n,
        modifiedCount: result.modifiedCount ?? result.nModified
      });
    }

    const worker = await User.findByIdAndUpdate(
      workerId,
      { status, allocatedComplaint },
      { new: true }
    );
    res.json({ message: 'Worker updated successfully', worker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/workers/my-complaints
router.get('/my-complaints', auth, async (req, res) => {
    try {
      const workerId = req.user._id;
  
      // Find complaints where this worker is assigned
      const complaints = await Complaint.find({ assignedWorkers: workerId })
        .select('location department description status _id');
  
      res.json({ complaints });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


// POST /api/workers/submit-images-complaint
router.post('/submit-images-complaint', auth, upload.array('images'), async (req, res) => {
  try {
    const { complaintId } = req.body;
    const workerId = req.user._id;
    const files = Array.isArray(req.files) ? req.files : [];

    if (!complaintId) {
      return res.status(400).json({ message: 'complaintId is required' });
    }

    // Verify the complaint exists and the worker is assigned to it
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!complaint.assignedWorkers.includes(workerId)) {
      return res.status(403).json({ message: 'You are not assigned to this complaint' });
    }

    if (files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload all images to Cloudinary in parallel
    let uploadedImages = [];
    if (files.length > 0) {
      const uploadPromises = files.map(file => {
        return cloudinary.uploader
          .upload(file.path, { folder: 'complaints/submitted', timeout: 10000, resource_type: 'image' })
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

    // Add the new images to the existing submittedImages array
    complaint.submittedImages = [...(complaint.submittedImages || []), ...uploadedImages];
    await complaint.save();

    res.json({ 
      message: 'Images submitted successfully',
      complaint: complaint,
      uploadedImages: uploadedImages
    });
  } catch (err) {
    console.error('Error in /submit-images-complaint:', err);
    const isTimeout = /timed out|Timeout/i.test(err?.message || '');
    res.status(isTimeout ? 504 : 500).json({ 
      message: isTimeout ? 'Upload to Cloudinary timed out' : 'Error submitting images', 
      error: err.message 
    });
  }
});
  

module.exports = router;
