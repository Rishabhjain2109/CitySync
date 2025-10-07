const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['citizen', 'departmentHead', 'worker'],
    required: true
  },
  email: {
    type: String,
    required: function() {
      return this.userType === 'citizen';
    },
    unique: true,
    sparse: true,
    lowercase: true,
    default: undefined
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  enrollmentNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: undefined
  },
  status: {
    type: String,
    enum: ['active', 'busy'],
    default: 'active'
  },
  department: {
    type: String,
    enum: ['sewage', 'garbage', 'road', 'water', 'electricity'],
    required: function() {
      return this.userType === 'departmentHead' || this.userType === 'worker';
    }
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
  assignedHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.userType === 'worker';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allocatedComplaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
