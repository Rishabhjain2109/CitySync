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
    const { date, search, type } = req.query; // get filters from query params
    console.log(req.query);
    

    // Base filter: department of the logged-in head
    const filter = { department: head.department };

    // Date filter (assuming Complaint schema has a `createdAt` field)
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Search filter
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i"); // case-insensitive
      filter.$or = [
        { description: searchRegex },
        { location: searchRegex },
        { status: searchRegex },
      ];
    }
    filter.status = type;

    // Fetch complaints
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    // console.log(complaints);
    
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/update-complaint', auth, async (req, res) => {
  try {
    const { complaintId, status, workerIDs } = req.body;
    const complaintBefore=await Complaint.findById(complaintId).populate('citizen');
    if (!complaintBefore) return res.status(404).json({ message: 'Complaint not found' });
    const oldStatus = complaintBefore.status;

    //const complaint = await Complaint.findByIdAndUpdate(complaintId, { status, assignedWorkers: workerIDs }, { new: true });
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status, assignedWorkers: workerIDs },
      { new: true }
    ).populate('citizen');

    console.log(workerIDs);
    
    if (status === "resolved" && Array.isArray(workerIDs) && workerIDs.length > 0) {
      const updateResult = await User.updateMany(
        { _id: { $in: workerIDs } },
        { $set: { status: 'active' } }
      );

      console.log("Workers updated:", updateResult.modifiedCount);
    }

    // 🔔 Send notifications if status changed
      //const oldStatus = complaint.status === 'assigned' ? 'pending' : 'assigned';
      if(oldStatus!=status){
      const citizenEmail = complaint.citizen.email;
      const citizenPhone = complaint.citizen.phone;

      // Example messages
      const message = `Your complaint "${complaint.description}" status changed from ${oldStatus} to ${status}.`;

      // Send email
      sendEmail(citizenEmail, 'Complaint Status Update', message);

      // Send SMS
       sendSMS(citizenPhone, message);
      }

      // Optional: push notification
      // sendPush(complaint.citizen.deviceToken, message);
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

// Get platform-wide complaint statistics
router.get('/platform-stats', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.userType !== 'citizen') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get ALL complaints on the platform
    const allComplaints = await Complaint.find({});
    
    // Count complaints by status
    const stats = {
      total: allComplaints.length,
      pending: allComplaints.filter(c => c.status === 'pending').length,
      assigned: allComplaints.filter(c => c.status === 'assigned').length,
      resolved: allComplaints.filter(c => c.status === 'resolved').length
    };

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/complaint-submitted-image', auth, async (req, res) => {
  try {
    const { status, id } = req.query; 

    if (!id || !status) {
      return res.status(400).json({ message: "Missing required parameters (id or status)." });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    const imageArr = status === 'pending' ? complaint.images : complaint.submittedImages;

    res.status(200).json(imageArr);
  } catch (error) {
    console.error("Error fetching complaint images:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
