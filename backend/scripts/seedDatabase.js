const mongoose = require('mongoose');
const Department = require('../models/Department');
const User = require('../models/User');
const EnrollmentCredential = require('../models/EnrollmentCredential');
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
    await EnrollmentCredential.deleteMany({});
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

    // Create enrollment credentials for all enrollment numbers
    const enrollmentCredentials = [];
    
    // Sample personal information for department heads
    const headPersonalInfo = {
      'sewage': [
        { name: 'Rajesh Kumar', phone: '9876543210', address: '123 Main Street, City Center' },
        { name: 'Priya Sharma', phone: '9876543211', address: '456 Park Avenue, Downtown' },
        { name: 'Amit Singh', phone: '9876543212', address: '789 Highway Road, Suburb' },
        { name: 'Sunita Patel', phone: '9876543213', address: '321 Water Lane, Riverside' },
        { name: 'Vikram Reddy', phone: '9876543214', address: '654 Power Street, Industrial Area' }
      ],
      'garbage': [
        { name: 'Ravi Yadav', phone: '9876543220', address: '111 Garbage Street, Downtown' },
        { name: 'Suresh Gupta', phone: '9876543221', address: '212 Waste Lane, Suburb' },
        { name: 'Kumar Singh', phone: '9876543222', address: '313 Collection Road, City Center' },
        { name: 'Rajesh Tiwari', phone: '9876543223', address: '414 Disposal Avenue, Riverside' },
        { name: 'Anil Kumar', phone: '9876543224', address: '515 Trash Street, Industrial Area' }
      ],
      'road': [
        { name: 'Pradeep Sharma', phone: '9876543230', address: '121 Road Street, Suburb' },
        { name: 'Sandeep Kumar', phone: '9876543231', address: '222 Highway Lane, City Center' },
        { name: 'Vijay Singh', phone: '9876543232', address: '323 Maintenance Road, Downtown' },
        { name: 'Deepak Verma', phone: '9876543233', address: '424 Repair Avenue, Riverside' },
        { name: 'Manoj Kumar', phone: '9876543234', address: '525 Construction Street, Industrial Area' }
      ],
      'water': [
        { name: 'Ravi Kumar', phone: '9876543240', address: '131 Water Street, Riverside' },
        { name: 'Sunil Sharma', phone: '9876543241', address: '232 Supply Lane, City Center' },
        { name: 'Rajesh Patel', phone: '9876543242', address: '333 Distribution Road, Downtown' },
        { name: 'Amit Yadav', phone: '9876543243', address: '434 Pipeline Avenue, Suburb' },
        { name: 'Vikram Singh', phone: '9876543244', address: '535 Treatment Street, Industrial Area' }
      ],
      'electricity': [
        { name: 'Suresh Kumar', phone: '9876543250', address: '141 Power Street, Industrial Area' },
        { name: 'Kumar Reddy', phone: '9876543251', address: '242 Electric Lane, City Center' },
        { name: 'Rajesh Verma', phone: '9876543252', address: '343 Grid Road, Downtown' },
        { name: 'Anil Singh', phone: '9876543253', address: '444 Circuit Avenue, Suburb' },
        { name: 'Pradeep Yadav', phone: '9876543254', address: '545 Wire Street, Riverside' }
      ]
    };

    // Sample personal information for workers
    const workerPersonalInfo = {
      'sewage': [
        { name: 'Manoj Kumar', phone: '9876543300', address: '111 Sewage Lane, City Center' },
        { name: 'Deepak Verma', phone: '9876543301', address: '112 Sewage Lane, City Center' },
        { name: 'Ravi Singh', phone: '9876543302', address: '113 Sewage Lane, City Center' },
        { name: 'Suresh Kumar', phone: '9876543303', address: '114 Sewage Lane, City Center' },
        { name: 'Amit Yadav', phone: '9876543304', address: '115 Sewage Lane, City Center' },
        { name: 'Rajesh Patel', phone: '9876543305', address: '116 Sewage Lane, City Center' },
        { name: 'Vikram Singh', phone: '9876543306', address: '117 Sewage Lane, City Center' },
        { name: 'Anil Kumar', phone: '9876543307', address: '118 Sewage Lane, City Center' },
        { name: 'Pradeep Sharma', phone: '9876543308', address: '119 Sewage Lane, City Center' },
        { name: 'Sandeep Yadav', phone: '9876543309', address: '120 Sewage Lane, City Center' },
        { name: 'Kumar Singh', phone: '9876543310', address: '121 Sewage Lane, City Center' },
        { name: 'Deepak Kumar', phone: '9876543311', address: '122 Sewage Lane, City Center' },
        { name: 'Manoj Singh', phone: '9876543312', address: '123 Sewage Lane, City Center' },
        { name: 'Ravi Kumar', phone: '9876543313', address: '124 Sewage Lane, City Center' },
        { name: 'Suresh Singh', phone: '9876543314', address: '125 Sewage Lane, City Center' }
      ],
      'garbage': [
        { name: 'Ravi Yadav', phone: '9876543400', address: '211 Garbage Street, Downtown' },
        { name: 'Suresh Gupta', phone: '9876543401', address: '212 Garbage Street, Downtown' },
        { name: 'Kumar Singh', phone: '9876543402', address: '213 Garbage Street, Downtown' },
        { name: 'Rajesh Tiwari', phone: '9876543403', address: '214 Garbage Street, Downtown' },
        { name: 'Anil Kumar', phone: '9876543404', address: '215 Garbage Street, Downtown' },
        { name: 'Pradeep Sharma', phone: '9876543405', address: '216 Garbage Street, Downtown' },
        { name: 'Sandeep Kumar', phone: '9876543406', address: '217 Garbage Street, Downtown' },
        { name: 'Vijay Singh', phone: '9876543407', address: '218 Garbage Street, Downtown' },
        { name: 'Deepak Verma', phone: '9876543408', address: '219 Garbage Street, Downtown' },
        { name: 'Manoj Kumar', phone: '9876543409', address: '220 Garbage Street, Downtown' },
        { name: 'Ravi Singh', phone: '9876543410', address: '221 Garbage Street, Downtown' },
        { name: 'Amit Yadav', phone: '9876543411', address: '222 Garbage Street, Downtown' },
        { name: 'Rajesh Patel', phone: '9876543412', address: '223 Garbage Street, Downtown' },
        { name: 'Vikram Singh', phone: '9876543413', address: '224 Garbage Street, Downtown' },
        { name: 'Sunil Kumar', phone: '9876543414', address: '225 Garbage Street, Downtown' }
      ],
      'road': [
        { name: 'Kumar Singh', phone: '9876543500', address: '311 Road Avenue, Suburb' },
        { name: 'Rajesh Tiwari', phone: '9876543501', address: '312 Road Avenue, Suburb' },
        { name: 'Anil Kumar', phone: '9876543502', address: '313 Road Avenue, Suburb' },
        { name: 'Pradeep Sharma', phone: '9876543503', address: '314 Road Avenue, Suburb' },
        { name: 'Sandeep Kumar', phone: '9876543504', address: '315 Road Avenue, Suburb' },
        { name: 'Vijay Singh', phone: '9876543505', address: '316 Road Avenue, Suburb' },
        { name: 'Deepak Verma', phone: '9876543506', address: '317 Road Avenue, Suburb' },
        { name: 'Manoj Kumar', phone: '9876543507', address: '318 Road Avenue, Suburb' },
        { name: 'Ravi Singh', phone: '9876543508', address: '319 Road Avenue, Suburb' },
        { name: 'Amit Yadav', phone: '9876543509', address: '320 Road Avenue, Suburb' },
        { name: 'Rajesh Patel', phone: '9876543510', address: '321 Road Avenue, Suburb' },
        { name: 'Vikram Singh', phone: '9876543511', address: '322 Road Avenue, Suburb' },
        { name: 'Sunil Kumar', phone: '9876543512', address: '323 Road Avenue, Suburb' },
        { name: 'Suresh Singh', phone: '9876543513', address: '324 Road Avenue, Suburb' },
        { name: 'Kumar Yadav', phone: '9876543514', address: '325 Road Avenue, Suburb' }
      ],
      'water': [
        { name: 'Anil Kumar', phone: '9876543600', address: '411 Water Street, Riverside' },
        { name: 'Pradeep Sharma', phone: '9876543601', address: '412 Water Street, Riverside' },
        { name: 'Sandeep Kumar', phone: '9876543602', address: '413 Water Street, Riverside' },
        { name: 'Vijay Singh', phone: '9876543603', address: '414 Water Street, Riverside' },
        { name: 'Deepak Verma', phone: '9876543604', address: '415 Water Street, Riverside' },
        { name: 'Manoj Kumar', phone: '9876543605', address: '416 Water Street, Riverside' },
        { name: 'Ravi Singh', phone: '9876543606', address: '417 Water Street, Riverside' },
        { name: 'Amit Yadav', phone: '9876543607', address: '418 Water Street, Riverside' },
        { name: 'Rajesh Patel', phone: '9876543608', address: '419 Water Street, Riverside' },
        { name: 'Vikram Singh', phone: '9876543609', address: '420 Water Street, Riverside' },
        { name: 'Sunil Kumar', phone: '9876543610', address: '421 Water Street, Riverside' },
        { name: 'Suresh Singh', phone: '9876543611', address: '422 Water Street, Riverside' },
        { name: 'Kumar Yadav', phone: '9876543612', address: '423 Water Street, Riverside' },
        { name: 'Ravi Kumar', phone: '9876543613', address: '424 Water Street, Riverside' },
        { name: 'Anil Singh', phone: '9876543614', address: '425 Water Street, Riverside' }
      ],
      'electricity': [
        { name: 'Sandeep Kumar', phone: '9876543700', address: '511 Power Lane, Industrial Area' },
        { name: 'Vijay Singh', phone: '9876543701', address: '512 Power Lane, Industrial Area' },
        { name: 'Deepak Verma', phone: '9876543702', address: '513 Power Lane, Industrial Area' },
        { name: 'Manoj Kumar', phone: '9876543703', address: '514 Power Lane, Industrial Area' },
        { name: 'Ravi Singh', phone: '9876543704', address: '515 Power Lane, Industrial Area' },
        { name: 'Amit Yadav', phone: '9876543705', address: '516 Power Lane, Industrial Area' },
        { name: 'Rajesh Patel', phone: '9876543706', address: '517 Power Lane, Industrial Area' },
        { name: 'Vikram Singh', phone: '9876543707', address: '518 Power Lane, Industrial Area' },
        { name: 'Sunil Kumar', phone: '9876543708', address: '519 Power Lane, Industrial Area' },
        { name: 'Suresh Singh', phone: '9876543709', address: '520 Power Lane, Industrial Area' },
        { name: 'Kumar Yadav', phone: '9876543710', address: '521 Power Lane, Industrial Area' },
        { name: 'Ravi Kumar', phone: '9876543711', address: '522 Power Lane, Industrial Area' },
        { name: 'Anil Singh', phone: '9876543712', address: '523 Power Lane, Industrial Area' },
        { name: 'Pradeep Kumar', phone: '9876543713', address: '524 Power Lane, Industrial Area' },
        { name: 'Sandeep Singh', phone: '9876543714', address: '525 Power Lane, Industrial Area' }
      ]
    };
    
    departments.forEach(dept => {
      // Create credentials for department heads
      dept.headEnrollmentNumbers.forEach((enrollmentNumber, index) => {
        const personalInfo = headPersonalInfo[dept.name][index];
        enrollmentCredentials.push({
          enrollmentNumber,
          password: `${enrollmentNumber}@123`,
          userType: 'departmentHead',
          department: dept.name,
          name: personalInfo.name,
          phone: personalInfo.phone,
          address: personalInfo.address
        });
      });
      
      // Create credentials for workers
      dept.workerEnrollmentNumbers.forEach((enrollmentNumber, index) => {
        const personalInfo = workerPersonalInfo[dept.name][index];
        enrollmentCredentials.push({
          enrollmentNumber,
          password: `${enrollmentNumber}@123`,
          userType: 'worker',
          department: dept.name,
          name: personalInfo.name,
          phone: personalInfo.phone,
          address: personalInfo.address
        });
      });
    });

    await EnrollmentCredential.insertMany(enrollmentCredentials);
    console.log('✅ Created enrollment credentials');

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
      // Find the corresponding enrollment credential to get the correct password
      const credential = await EnrollmentCredential.findOne({
        enrollmentNumber: headData.enrollmentNumber,
        userType: 'departmentHead'
      });
      
      const head = new User({
        userType: 'departmentHead',
        enrollmentNumber: headData.enrollmentNumber,
        password: credential.password, // Use the enrollment credential password
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
      
      // Find the corresponding enrollment credential to get the correct password
      const credential = await EnrollmentCredential.findOne({
        enrollmentNumber: workerData.enrollmentNumber,
        userType: 'worker'
      });
      
      const worker = new User({
        userType: 'worker',
        enrollmentNumber: workerData.enrollmentNumber,
        password: credential.password, // Use the enrollment credential password
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

    console.log('\n🔑 Enrollment Credentials Created:');
    console.log(`   📋 Total Credentials: ${enrollmentCredentials.length}`);
    console.log(`   🔐 Default Password Format: {enrollmentNumber}@123`);
    console.log(`   📝 Example: SEW001 → Password: SEW001@123`);

    console.log('\n👥 Sample Users Created:');
    console.log(`   👔 Department Heads: ${createdHeads.length}`);
    console.log(`   👷 Workers: ${sampleWorkers.length}`);
    console.log(`   👤 Citizens: 0 (Citizens can sign up freely)`);

    console.log('\n🔑 Test Credentials:');
    console.log('   📧 Citizens can sign up with any email address');
    console.log('   📱 Department heads login with enrollment numbers / {enrollmentNumber}@123');
    console.log('   👷 Workers login with enrollment numbers / {enrollmentNumber}@123');
    console.log('   📝 Examples:');
    console.log('      - SEW001 / SEW001@123 (Department Head)');
    console.log('      - SEW101 / SEW101@123 (Worker)');

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
