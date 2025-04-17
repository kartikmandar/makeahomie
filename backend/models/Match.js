const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user1Id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user2Id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  proximityScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
    comment: 'Score based on physical proximity from IoT devices'
  }
});

module.exports = Match;