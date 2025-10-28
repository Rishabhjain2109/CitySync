// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const Complaint = require('../models/Complaint');
const Application = require('../models/Application');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // max 5 files
  }
});


// Fixed admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // simple JWT for admin
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Get all complaints (admin-only)
router.get('/complaints', auth, async (req, res) => {
  try {
    // Only allow admin access
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const complaints = await Complaint.find()
    .populate({
      path: 'assignedWorkers',
      populate: { path: 'assignedHead', select: 'name' } // nested populate to get the head of each worker
    })
    .populate('citizen', 'name email'); // populate citizen info if needed
  
    res.json({ complaints });
  } catch (err) {
    console.error('Admin complaints error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/submit-applications", upload.fields([{ name: "applicationImage", maxCount: 1 },{ name: "govtId", maxCount: 1 },]), async (req, res) => {
    try {
      const { name, department, mobileNumber, email } = req.body;
      const files = req.files;

      console.log("hello");
      

      if (!files || !files.applicationImage || !files.govtId || !name || !department || (!mobileNumber && !email)) {
        return res.status(400).json({ message: "All required fields must be filled." });
      }

      // Helper to upload buffer to Cloudinary
      const uploadToCloudinary = (fileBuffer, folder) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
          stream.end(fileBuffer);
        });

      // Upload both files
      const applicationImageResult = await uploadToCloudinary(files.applicationImage[0].buffer, "applications");
      const govtIdResult = await uploadToCloudinary(files.govtId[0].buffer, "applications");

      // Create new application
      const application = new Application({
        name,
        department,
        mobileNumber,
        email,
        applicationImageUrl: applicationImageResult.secure_url,
        govtIdUrl: govtIdResult.secure_url,
        // submittedBy: req.user._id, // removed since no auth middleware
      });


      await application.save();

      res.status(200).json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Error in /submit-applications:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
