const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'parent', 'educator'),
    allowNull: false
  },
  subscription: {
    type: DataTypes.ENUM('free', 'basic', 'premium'),
    defaultValue: 'free'
  },
  studentCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  licenseLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
});

// Define the relationships
const StudentParent = sequelize.define('StudentParent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'parentId']
    }
  ]
});

const StudentEducator = sequelize.define('StudentEducator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'educatorId']
    }
  ]
});

// Many-to-Many: Students <-> Parents
User.belongsToMany(User, {
  through: StudentParent,
  as: 'parents',
  foreignKey: 'studentId',
  otherKey: 'parentId'
});

User.belongsToMany(User, {
  through: StudentParent,
  as: 'children',
  foreignKey: 'parentId',
  otherKey: 'studentId'
});

// Many-to-Many: Students <-> Educators
User.belongsToMany(User, {
  through: StudentEducator,
  as: 'educators',
  foreignKey: 'studentId',
  otherKey: 'educatorId'
});

User.belongsToMany(User, {
  through: StudentEducator,
  as: 'students',
  foreignKey: 'educatorId',
  otherKey: 'studentId'
});

module.exports = { User, StudentParent, StudentEducator };
