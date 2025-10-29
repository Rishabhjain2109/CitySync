const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const Application = require('../models/Application');
const jwt = require('jsonwebtoken');


router.get('/get-application/:id', auth, async (req, res)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded.isAdmin) {
          return res.status(403).json({ message: "Access denied. Admin only." });
        }
        const {id} = req.params;
        const data = await Application.findById(id);

        // console.log(req.body.id);
        
    
        res.status(200).json({ message: "Application submitted successfully", data });
    } catch (error) {
        console.error("Error in fetching data", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;