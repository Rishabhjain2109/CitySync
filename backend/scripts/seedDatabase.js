const mongoose = require('mongoose');
const Department = require('../models/Department');
const User = require('../models/User');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // Clear existing data
    await Department.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Define departments with enrollment numbers
    const departments = [
      {
        name: 'sewage',
        displayName: 'Sewage Management',
        description: 'Handles sewage and drainage related issues',
        headEnrollmentNumbers: [
          'SEW001', 'SEW002', 'SEW003', 'SEW004', 'SEW005'
        ],
        workerEnrollmentNumbers: [
          'SEW101', 'SEW102', 'SEW103', 'SEW104', 'SEW105',
          'SEW106', 'SEW107', 'SEW108', 'SEW109', 'SEW110',
          'SEW111', 'SEW112', 'SEW113', 'SEW114', 'SEW115'
        ]
      },
      {
        name: 'garbage',
        displayName: 'Garbage Collection',
        description: 'Manages waste collection and disposal',
        headEnrollmentNumbers: [
          'GAR001', 'GAR002', 'GAR003', 'GAR004', 'GAR005'
        ],
        workerEnrollmentNumbers: [
          'GAR101', 'GAR102', 'GAR103', 'GAR104', 'GAR105',
          'GAR106', 'GAR107', 'GAR108', 'GAR109', 'GAR110',
          'GAR111', 'GAR112', 'GAR113', 'GAR114', 'GAR115'
        ]
      },
      {
        name: 'road',
        displayName: 'Road Maintenance',
        description: 'Handles road repairs and maintenance',
        headEnrollmentNumbers: [
          'ROD001', 'ROD002', 'ROD003', 'ROD004', 'ROD005'
        ],
        workerEnrollmentNumbers: [
          'ROD101', 'ROD102', 'ROD103', 'ROD104', 'ROD105',
          'ROD106', 'ROD107', 'ROD108', 'ROD109', 'ROD110',
          'ROD111', 'ROD112', 'ROD113', 'ROD114', 'ROD115'
        ]
      },
      {
        name: 'water',
        displayName: 'Water Supply',
        description: 'Manages water supply and distribution',
        headEnrollmentNumbers: [
          'WAT001', 'WAT002', 'WAT003', 'WAT004', 'WAT005'
        ],
        workerEnrollmentNumbers: [
          'WAT101', 'WAT102', 'WAT103', 'WAT104', 'WAT105',
          'WAT106', 'WAT107', 'WAT108', 'WAT109', 'WAT110',
          'WAT111', 'WAT112', 'WAT113', 'WAT114', 'WAT115'
        ]
      },
      {
        name: 'electricity',
        displayName: 'Electricity',
        description: 'Handles electrical infrastructure and repairs',
        headEnrollmentNumbers: [
          'ELE001', 'ELE002', 'ELE003', 'ELE004', 'ELE005'
        ],
        workerEnrollmentNumbers: [
          'ELE101', 'ELE102', 'ELE103', 'ELE104', 'ELE105',
          'ELE106', 'ELE107', 'ELE108', 'ELE109', 'ELE110',
          'ELE111', 'ELE112', 'ELE113', 'ELE114', 'ELE115'
        ]
      }
    ];

    // Insert departments
    await Department.insertMany(departments);
    console.log('✅ Successfully seeded departments');

    // Create sample department heads
    const sampleHeads = [
      {
        enrollmentNumber: 'SEW001',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        address: '123 Main Street, City Center',
        department: 'sewage'
      },
      {
        enrollmentNumber: 'GAR001',
        name: 'Priya Sharma',
        phone: '9876543211',
        address: '456 Park Avenue, Downtown',
        department: 'garbage'
      },
      {
        enrollmentNumber: 'ROD001',
        name: 'Amit Singh',
        phone: '9876543212',
        address: '789 Highway Road, Suburb',
        department: 'road'
      },
      {
        enrollmentNumber: 'WAT001',
        name: 'Sunita Patel',
        phone: '9876543213',
        address: '321 Water Lane, Riverside',
        department: 'water'
      },
      {
        enrollmentNumber: 'ELE001',
        name: 'Vikram Reddy',
        phone: '9876543214',
        address: '654 Power Street, Industrial Area',
        department: 'electricity'
      }
    ];

    // Create sample workers
    const sampleWorkers = [
      // Sewage workers
      {
        enrollmentNumber: 'SEW101',
        name: 'Manoj Kumar',
        phone: '9876543220',
        address: '111 Sewage Lane, City Center',
        department: 'sewage'
      },
      {
        enrollmentNumber: 'SEW102',
        name: 'Deepak Verma',
        phone: '9876543221',
        address: '112 Sewage Lane, City Center',
        department: 'sewage'
      },
      // Garbage workers
      {
        enrollmentNumber: 'GAR101',
        name: 'Ravi Yadav',
        phone: '9876543230',
        address: '211 Garbage Street, Downtown',
        department: 'garbage'
      },
      {
        enrollmentNumber: 'GAR102',
        name: 'Suresh Gupta',
        phone: '9876543231',
        address: '212 Garbage Street, Downtown',
        department: 'garbage'
      },
      // Road workers
      {
        enrollmentNumber: 'ROD101',
        name: 'Kumar Singh',
        phone: '9876543240',
        address: '311 Road Avenue, Suburb',
        department: 'road'
      },
      {
        enrollmentNumber: 'ROD102',
        name: 'Rajesh Tiwari',
        phone: '9876543241',
        address: '312 Road Avenue, Suburb',
        department: 'road'
      },
      // Water workers
      {
        enrollmentNumber: 'WAT101',
        name: 'Anil Kumar',
        phone: '9876543250',
        address: '411 Water Street, Riverside',
        department: 'water'
      },
      {
        enrollmentNumber: 'WAT102',
        name: 'Pradeep Sharma',
        phone: '9876543251',
        address: '412 Water Street, Riverside',
        department: 'water'
      },
      // Electricity workers
      {
        enrollmentNumber: 'ELE101',
        name: 'Sandeep Kumar',
        phone: '9876543260',
        address: '511 Power Lane, Industrial Area',
        department: 'electricity'
      },
      {
        enrollmentNumber: 'ELE102',
        name: 'Vijay Singh',
        phone: '9876543261',
        address: '512 Power Lane, Industrial Area',
        department: 'electricity'
      }
    ];

    // Create department heads
    const createdHeads = [];
    for (const headData of sampleHeads) {
      const head = new User({
        userType: 'departmentHead',
        enrollmentNumber: headData.enrollmentNumber,
        password: 'password123', // Default password for testing
        department: headData.department,
        name: headData.name,
        phone: headData.phone,
        address: headData.address
      });
      await head.save();
      createdHeads.push(head);
    }
    console.log('✅ Created sample department heads');

    // Create workers and assign them to department heads
    for (const workerData of sampleWorkers) {
      const departmentHead = createdHeads.find(head => head.department === workerData.department);
      
      const worker = new User({
        userType: 'worker',
        enrollmentNumber: workerData.enrollmentNumber,
        password: 'password123', // Default password for testing
        department: workerData.department,
        assignedHead: departmentHead._id,
        name: workerData.name,
        phone: workerData.phone,
        address: workerData.address
      });
      await worker.save();
    }
    console.log('✅ Created sample workers');

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    
    const createdDepartments = await Department.find({});
    let totalHeads = 0;
    let totalWorkers = 0;

    createdDepartments.forEach(dept => {
      const headCount = dept.headEnrollmentNumbers.length;
      const workerCount = dept.workerEnrollmentNumbers.length;
      totalHeads += headCount;
      totalWorkers += workerCount;

      console.log(`\n🏢 ${dept.displayName}:`);
      console.log(`   📋 Available Head Numbers: ${headCount}`);
      console.log(`   👷 Available Worker Numbers: ${workerCount}`);
    });

    console.log('\n📈 Total Available Enrollment Numbers:');
    console.log(`   👔 Department Heads: ${totalHeads}`);
    console.log(`   👷 Workers: ${totalWorkers}`);
    console.log(`   📊 Grand Total: ${totalHeads + totalWorkers}`);

    console.log('\n👥 Sample Users Created:');
    console.log(`   👔 Department Heads: ${createdHeads.length}`);
    console.log(`   👷 Workers: ${sampleWorkers.length}`);

    console.log('\n🔑 Test Credentials:');
    console.log('   📧 All sample users have password: password123');
    console.log('   📱 Department heads can login with their enrollment numbers');
    console.log('   👷 Workers can login with their enrollment numbers');

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
seedDatabase();
