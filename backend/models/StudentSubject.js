const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Student = require('./Student');
const Subject = require('./Subject');

const StudentSubject = sequelize.define('StudentSubject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

Student.belongsToMany(Subject, { through: StudentSubject });
Subject.belongsToMany(Student, { through: StudentSubject });

module.exports = StudentSubject;
