const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // Define your user model attributes here
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // ... other attributes
  });

  return User;
};
