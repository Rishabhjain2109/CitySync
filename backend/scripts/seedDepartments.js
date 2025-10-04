const mongoose = require('mongoose');
const Department = require('./models/Department');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDepartments = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing departments
    await Department.deleteMany({});
    console.log('✅ Cleared existing departments');

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
      console.log(`   📋 Department Heads: ${headCount} enrollment numbers`);
      console.log(`   👷 Workers: ${workerCount} enrollment numbers`);
      console.log(`   📝 Head Numbers: ${dept.headEnrollmentNumbers.join(', ')}`);
      console.log(`   📝 Worker Numbers: ${dept.workerEnrollmentNumbers.slice(0, 5).join(', ')}${dept.workerEnrollmentNumbers.length > 5 ? '...' : ''}`);
    });

    console.log('\n📈 Total Enrollment Numbers:');
    console.log(`   👔 Department Heads: ${totalHeads}`);
    console.log(`   👷 Workers: ${totalWorkers}`);
    console.log(`   📊 Grand Total: ${totalHeads + totalWorkers}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Department heads can now register using their enrollment numbers');
    console.log('2. Workers can register using their enrollment numbers');
    console.log('3. Each worker will be automatically assigned to their department');
    console.log('4. Department heads can see all workers under their department');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
seedDepartments();
