// Simple script to check all users in the database
const { Sequelize } = require('sequelize');
const path = require('path');

// Direct connection to the database file
const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
console.log(`Using database at: ${dbPath}`);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

async function checkUsers() {
  try {
    // First check if we can connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.\n');
    
    // Query all users directly using raw SQL
    const [users] = await sequelize.query('SELECT * FROM Users');
    
    console.log(`Found ${users.length} users in the database:\n`);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`--- User ${index + 1} ---`);
        console.log(`UserID: ${user.UserID}`);
        console.log(`Name: ${user.name || 'unnamed'}`);
        console.log(`Department: ${user.department || 'not specified'}`);
        console.log(`Join reason: ${user.join_reason || 'not specified'}`);
        console.log(`Combined text: ${user.combined_text ? 'present' : 'missing'}`);
        console.log('-------------------\n');
      });
    } else {
      console.log("No users found in the database.");
    }
    
    // Also check matches table
    const [matches] = await sequelize.query('SELECT * FROM Matches');
    
    console.log(`Found ${matches.length} matches in the database:\n`);
    
    if (matches.length > 0) {
      matches.forEach((match, index) => {
        console.log(`--- Match ${index + 1} ---`);
        console.log(`User1: ${match.user1Id}`);
        console.log(`User2: ${match.user2Id}`);
        console.log(`Score: ${match.score}`);
        console.log('-------------------\n');
      });
    } else {
      console.log("No matches found in the database.");
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

checkUsers();
