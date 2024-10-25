const { Model, DataTypes } = require('sequelize');
const sequelize = require('../server').sequelize;

class User extends Model {}

User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  role: DataTypes.ENUM('student', 'parent', 'educator')
}, { sequelize, modelName: 'user' });

module.exports = User;
