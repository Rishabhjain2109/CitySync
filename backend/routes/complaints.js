const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const multer = require('multer');
const { sendEmail, sendSMS } = require('../config/notifications');
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
    const { description, address, type, latitude, longitude } = req.body;
    console.log(req.body);
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
      type, // ensure schema-required 'type' is set
      department: type,
      description,
      location: address,
      geo:{lat:latitude,lng:longitude},
      images: uploadedImages,
      status: 'pending',
      createdAt: new Date()
    });
    
    user.assignedComplaint.push(newComplaint._id);
    await user.save();
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

router.get('/headComplaints', auth, async (req, res) => {
  try {
    const head = req.user;
    console.log(head);
    const complaints = await Complaint.find({ department: head.department });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-complaint', auth, async (req, res) => {
  try {
    const { complaintId, status, workerIDs } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(complaintId, { status }, { new: true });
    
    console.log(workerIDs);
    
    if (status === "resolved" && Array.isArray(workerIDs) && workerIDs.length > 0) {
      const updateResult = await User.updateMany(
        { _id: { $in: workerIDs } },
        { $set: { status: 'active' } }
      );

      console.log("Workers updated:", updateResult.modifiedCount);
    }
    const complaint1 = await Complaint.findById(complaintId).populate('citizen assignedWorkers');

    if (!complaint1) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const oldStatus = complaint1.status; // save old status
    complaint1.status = status;
    complaint1.assignedWorkers = assignedWorkers || complaint1.assignedWorkers;

    await complaint1.save();

    // 🔔 Send notifications if status changed
    if (oldStatus !== status) {
      const citizenEmail = complaint1.citizen.email;
      const citizenPhone = complaint1.citizen.phone;

      // Example messages
      const message = `Your complaint "${complaint1.description}" status changed from ${oldStatus} to ${status}.`;

      // Send email
      sendEmail(citizenEmail, 'Complaint Status Update', message);

      // Send SMS
      sendSMS(citizenPhone, message);

      // Optional: push notification
      // sendPush(complaint.citizen.deviceToken, message);
    }
    res.json({ message: 'Complaint updated successfully', workerIDs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get complaints allocated to the logged-in worker
router.get('/allocated-complaint', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find all complaints where this user is assigned
    const complaints = await Complaint.find({ assignedWorkers: { $in: [userId] } });
    
    res.json({ complaint: complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/allocated-workers', auth, async (req, res) => {
  try {
    const { workerIds } = req.query;
    
    if (!workerIds) {
      return res.status(400).json({ message: 'workerIds parameter is required' });
    }

    // Parse workerIds if it's a string (could be comma-separated)
    const workerIdsArray = Array.isArray(workerIds) ? workerIds : workerIds.split(',');
    
    const allocatedWorkers = await User.find({ _id: { $in: workerIdsArray } });
    res.json({ allocatedWorkers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
