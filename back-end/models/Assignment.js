const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileContent: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

const LearningInsight = sequelize.define('LearningInsight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false
  },
  improvement: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define the relationship
Assignment.hasMany(LearningInsight, {
  foreignKey: 'assignmentId',
  as: 'LearningInsights'
});

LearningInsight.belongsTo(Assignment, {
  foreignKey: 'assignmentId'
});

module.exports = { Assignment, LearningInsight }; 