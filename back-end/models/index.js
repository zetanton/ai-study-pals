// models/index.js
const { Sequelize } = require('sequelize');
const UserModel = require('./User');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite')
});

const User = new UserModel(sequelize);

module.exports = {
  sequelize,
  User
};

