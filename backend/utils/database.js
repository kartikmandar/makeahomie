const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // File where the database will be stored
  logging: false // Disable logging SQL queries to the console
});

module.exports = sequelize;