const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  schoolName: {
    type: DataTypes.STRING,
    defaultValue: 'My Cartoon School'
  },
  logo: {
    type: DataTypes.TEXT, // Base64 or URL
    allowNull: true
  },
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#fbbf24' // accent-gold
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#ef4444' // accent-red
  }
});

module.exports = Setting;
