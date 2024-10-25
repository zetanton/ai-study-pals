const User = require('./User');
// Define other models like Medal, Progress, etc.

// Example relationship
User.hasMany(Medal, { as: 'medals' });
Medal.belongsTo(User, { foreignKey: 'userId' });

// Sync models with the database
sequelize.sync();
