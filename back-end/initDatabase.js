// initDatabase.js
const sequelize = require('./config/database');
const User = require('./models/User');
const { Assignment, LearningInsight } = require('./models/Assignment');

async function initDatabase() {
    try {
        // First sync all models with the database
        await sequelize.sync({ force: true });
        console.log('Database synced');
        
        // Create test user
        const user = await User.create({
            username: 'zetanton@gmail.com',
            password: 'password123' // Remember to hash passwords in production
        });
        console.log('Test user created');

        // Create sample assignment
        const assignment = await Assignment.create({
            userId: user.id,
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
            confidence: 0.85
        });
        console.log('Sample learning insight created');

        console.log('Database initialized with sample data');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Execute initialization
initDatabase()
    .then(() => {
        console.log('Database initialization complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });

