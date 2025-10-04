const mongoose = require('mongoose');
const Department = require('./models/Department');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citysync', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initializeDepartments = async () => {
  try {
    // Clear existing departments
    await Department.deleteMany({});
    
    // Create departments with enrollment numbers
    const departments = [
      {
        name: 'sewage',
        displayName: 'Sewage Management',
        description: 'Handles sewage and drainage related issues',
        headEnrollmentNumbers: ['SEW001', 'SEW002'],
        workerEnrollmentNumbers: ['SEW101', 'SEW102', 'SEW103', 'SEW104', 'SEW105']
      },
      {
        name: 'garbage',
        displayName: 'Garbage Collection',
        description: 'Manages waste collection and disposal',
        headEnrollmentNumbers: ['GAR001', 'GAR002'],
        workerEnrollmentNumbers: ['GAR101', 'GAR102', 'GAR103', 'GAR104', 'GAR105']
      },
      {
        name: 'road',
        displayName: 'Road Maintenance',
        description: 'Handles road repairs and maintenance',
        headEnrollmentNumbers: ['ROD001', 'ROD002'],
        workerEnrollmentNumbers: ['ROD101', 'ROD102', 'ROD103', 'ROD104', 'ROD105']
      },
      {
        name: 'water',
        displayName: 'Water Supply',
        description: 'Manages water supply and distribution',
        headEnrollmentNumbers: ['WAT001', 'WAT002'],
        workerEnrollmentNumbers: ['WAT101', 'WAT102', 'WAT103', 'WAT104', 'WAT105']
      },
      {
        name: 'electricity',
        displayName: 'Electricity',
        description: 'Handles electrical infrastructure and repairs',
        headEnrollmentNumbers: ['ELE001', 'ELE002'],
        workerEnrollmentNumbers: ['ELE101', 'ELE102', 'ELE103', 'ELE104', 'ELE105']
      }
    ];

    await Department.insertMany(departments);
    console.log('Departments initialized successfully!');
    
    // Display created departments
    const createdDepartments = await Department.find({});
    console.log('\nCreated Departments:');
    createdDepartments.forEach(dept => {
      console.log(`\n${dept.displayName}:`);
      console.log(`  Head Enrollment Numbers: ${dept.headEnrollmentNumbers.join(', ')}`);
      console.log(`  Worker Enrollment Numbers: ${dept.workerEnrollmentNumbers.join(', ')}`);
    });
    
  } catch (error) {
    console.error('Error initializing departments:', error);
  } finally {
    mongoose.connection.close();
  }
};

initializeDepartments();
