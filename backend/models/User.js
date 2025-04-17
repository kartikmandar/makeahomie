const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Allow null during registration, filled in during profile setup
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true // Allow null during initial registration
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_study: {
    type: DataTypes.STRING,
    allowNull: true
  },
  socialization_preference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meeting_preference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  join_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  introvert_scale: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  discussion_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  combined_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mac: {
    type: DataTypes.STRING,
    defaultValue: ""
  }
});

module.exports = User;