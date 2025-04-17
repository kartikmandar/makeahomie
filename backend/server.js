const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const chatRoutes = require('./routes/chat');
const presenceRoutes = require('./routes/presence');
const raspberryPiRoutes = require('./routes/raspberry_pi');

// Import models to ensure they're initialized
require('./models/User');
require('./models/PresenceLog');
require('./models/Match');
require('./models/Message');

const app = express();
const port = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/match', matchRoutes);
app.use('/chat', chatRoutes);
app.use('/presence', presenceRoutes);
app.use('/raspberry-pi', raspberryPiRoutes);

// Sync database and start server
sequelize.sync({ force: false }) // Use force: true only in development to recreate tables
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });