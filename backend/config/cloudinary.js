// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2; // <-- v2 is required
const dotenv = require('dotenv');

dotenv.config(); // load environment variables

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary config missing. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are set.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  timeout: 15000
});

console.log('Cloudinary loaded:', !!cloudinary.uploader); // should print true

module.exports = cloudinary;
