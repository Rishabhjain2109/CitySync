const mongoose = require('mongoose');

const enrollmentCredentialSchema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['departmentHead', 'worker'],
    required: true
  },
  department: {
    type: String,
    enum: ['sewage', 'garbage', 'road', 'water', 'electricity'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'busy'],
    default: 'active'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EnrollmentCredential', enrollmentCredentialSchema);
