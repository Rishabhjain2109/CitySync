// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2; // <-- v2 is required
const dotenv = require('dotenv');

dotenv.config(); // load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000
});

console.log('Cloudinary loaded:', !!cloudinary.uploader); // should print true

module.exports = cloudinary;
