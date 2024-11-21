// initDatabase.js
const sequelize = require('./config/database');
const User = require('./models/User');
const { Assignment, LearningInsight } = require('./models/Assignment');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function initDatabase() {
    try {
        // Sync all models with the database
        await sequelize.sync({ force: true });
        console.log('Database synced');
        
        // Create test users for each role
        const testUsers = await User.bulkCreate([
            {
                email: 'student@test.com',
                password: await hashPassword('password123'),
                name: 'Test Student',
                role: 'student',
                subscription: 'basic'
            },
            {
                email: 'parent@test.com',
                password: await hashPassword('password123'),
                name: 'Test Parent',
                role: 'parent',
                subscription: 'premium'
            },
            {
                email: 'educator@test.com',
                password: await hashPassword('password123'),
                name: 'Test Educator',
                role: 'educator',
                subscription: 'premium'
            }
        ]);
        console.log('Test users created');

        // Create sample assignment for the student
        const studentUser = testUsers.find(user => user.role === 'student');
        const assignment = await Assignment.create({
            userId: studentUser.id,
            subject: 'Mathematics',
            grade: 'A',
            fileName: 'sample_math_homework.pdf',
            fileContent: Buffer.from('Sample content')
        });
        console.log('Sample assignment created');

        // Create sample learning insight
        await LearningInsight.create({
            assignmentId: assignment.id,
            category: 'Problem Solving',
            strength: 'Shows good understanding of basic operations',
            improvement: 'Could work on showing detailed work steps',
            confidence: 85
        });
        console.log('Sample learning insight created');

        console.log('Database initialized with sample data');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Execute if this file is run directly
if (require.main === module) {
    initDatabase()
        .then(() => {
            console.log('Database initialization completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = initDatabase;

