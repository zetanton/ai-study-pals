// initDatabase.js
const sequelize = require('./config/database');
const { User, StudentParent, StudentEducator } = require('./models/User');
const { Assignment, LearningInsight } = require('./models/Assignment');
const bcrypt = require('bcrypt');

async function generateStudentCode() {
  console.log('Starting student code generation');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let attempts = 0;
  do {
    attempts++;
    code = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    console.log(`Generated code attempt ${attempts}: ${code}`);
    const existing = await User.findOne({ where: { studentCode: code }});
    if (!existing) {
      console.log(`Successfully generated unique student code: ${code}`);
      return code;
    }
    console.log(`Code ${code} already exists, trying again`);
  } while (true);
}

async function initDatabase() {
  console.log('Starting database initialization');
  try {
    console.log('Syncing database with force option...');
    await sequelize.sync({ force: true });
    console.log('Database sync completed successfully');
    
    // Create test users with relationships
    console.log('Creating test educator account...');
    const educator = await User.create({
      email: 'educator@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Educator',
      role: 'educator',
      subscription: 'premium',
      licenseLimit: 50
    });
    console.log(`Educator account created with ID: ${educator.id}`);

    console.log('Creating test parent account...');
    const parent = await User.create({
      email: 'parent@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Parent',
      role: 'parent',
      subscription: 'premium'
    });
    console.log(`Parent account created with ID: ${parent.id}`);

    console.log('Creating test student account...');
    const student = await User.create({
      email: 'student@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Student',
      role: 'student',
      subscription: 'basic',
      studentCode: await generateStudentCode()
    });
    console.log(`Student account created with ID: ${student.id}`);

    // Create relationships
    console.log('Creating student-parent relationship...');
    await StudentParent.create({
      studentId: student.id,
      parentId: parent.id
    });
    console.log(`Student-parent relationship created: Student ${student.id} - Parent ${parent.id}`);

    console.log('Creating student-educator relationship...');
    await StudentEducator.create({
      studentId: student.id,
      educatorId: educator.id
    });
    console.log(`Student-educator relationship created: Student ${student.id} - Educator ${educator.id}`);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

module.exports = { initDatabase };

if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

