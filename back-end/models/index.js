// models/index.js
const { Sequelize } = require('sequelize');
const { User, StudentParent, StudentEducator } = require('./User');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite')
});

module.exports = {
  sequelize,
  User,
  StudentParent,
  StudentEducator
};

