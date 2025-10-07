const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    // required: true
  },
  department: {
    type: String,
    enum: ['sewage', 'garbage', 'road', 'water', 'electricity'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  images: [
    {
      type: String, // Cloudinary URL
      required: true
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'resolved'],
    default: 'pending'
  },
  assignedWorkers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically update the updatedAt field before saving
complaintSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
