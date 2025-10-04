const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

require('dotenv').config({ path: './config.env' });
console.log('Mongo URI:', process.env.MONGODB_URI);

const db = process.env.MONGODB_URI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seed = async () => {
  try {

    const citizens = await User.find({ userType: 'citizen' });

    if (citizens.length === 0) {
      console.log('No citizens found. Seed some citizens first.');
      return;
    }


    await Complaint.deleteMany({});


    const complaintsData = [
        {
          citizen: citizens[0]._id,
          type: 'Sewage overflow',
          description: 'Sewage is overflowing near my street',
          department: 'sewage',
          location: 'Street 123, City',
          status: 'pending'
        },
        {
          citizen: citizens[1]?._id || citizens[0]._id,
          type: 'Pothole',
          description: 'Huge pothole on main road',
          department: 'road',
          location: 'Main Street, City',
          status: 'pending'
        },
        {
          citizen: citizens[0]._id,
          type: 'Garbage not collected',
          description: 'Garbage has not been collected for a week',
          department: 'garbage',
          location: 'Market Area, City',
          status: 'pending'
        }
      ];
      

    await Complaint.insertMany(complaintsData);
    console.log('Complaints seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
