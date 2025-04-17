const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const PresenceLog = sequelize.define('PresenceLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mac: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = PresenceLog;