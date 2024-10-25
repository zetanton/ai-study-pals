// initDatabase.js
const { User, sequelize } = require('./models/User');

async function initDatabase() {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    await User.create({
        username: 'Zachary',
        password: 'password123' // Remember to hash passwords in a real app
    });
}

initDatabase().then(() => {
    console.log('Database initialized');
});

