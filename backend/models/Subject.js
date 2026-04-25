const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING, // Pre-Nursery, Nursery, Primary, Secondary
    allowNull: false
  },
  level: {
    type: DataTypes.STRING, // e.g., Junior Secondary, Senior Secondary
    allowNull: false
  }
});

module.exports = Subject;
