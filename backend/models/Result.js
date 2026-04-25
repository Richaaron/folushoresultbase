const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Student = require('./Student');
const Subject = require('./Subject');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  term: {
    type: DataTypes.STRING, // First, Second, Third
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING, // e.g., 2025/2026
    allowNull: false
  },
  testScore: {
    type: DataTypes.FLOAT
  },
  examScore: {
    type: DataTypes.FLOAT
  },
  totalScore: {
    type: DataTypes.FLOAT
  },
  grade: {
    type: DataTypes.STRING
  },
  remark: {
    type: DataTypes.STRING
  }
});

Result.belongsTo(Student);
Result.belongsTo(Subject);

module.exports = Result;
