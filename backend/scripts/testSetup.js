const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citysync', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testSetup = async () => {
  try {
    console.log('Testing CitySync setup...\n');

    // Check departments
    const departments = await Department.find({});
    console.log(`✅ Found ${departments.length} departments:`);
    departments.forEach(dept => {
      console.log(`   - ${dept.displayName}: ${dept.headEnrollmentNumbers.length} heads, ${dept.workerEnrollmentNumbers.length} workers`);
    });

    // Check users
    const users = await User.find({});
    console.log(`\n✅ Found ${users.length} users:`);
    
    const citizens = users.filter(u => u.userType === 'citizen');
    const heads = users.filter(u => u.userType === 'departmentHead');
    const workers = users.filter(u => u.userType === 'worker');
    
    console.log(`   - Citizens: ${citizens.length}`);
    console.log(`   - Department Heads: ${heads.length}`);
    console.log(`   - Workers: ${workers.length}`);

    // Test enrollment numbers
    console.log('\n📋 Available enrollment numbers:');
    departments.forEach(dept => {
      console.log(`\n${dept.displayName}:`);
      console.log(`   Heads: ${dept.headEnrollmentNumbers.join(', ')}`);
      console.log(`   Workers: ${dept.workerEnrollmentNumbers.join(', ')}`);
    });

    console.log('\n🎉 Setup test completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Start the client: npm run client');
    console.log('3. Visit http://localhost:3000 to test the application');
    
  } catch (error) {
    console.error('❌ Setup test failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

testSetup();
