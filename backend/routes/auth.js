const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { UserID: user_id } });
    if (existingUser) {
      return res.status(400).json({ detail: 'User ID already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with ID and password only (profile details will be added later)
    await User.create({ 
      UserID: user_id,
      password: hashedPassword
    });

    res.json({ message: 'User registered successfully.' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ detail: 'An internal error occurred during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { UserID: user_id } });
    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials (user not found).' });
    }

    // Check password
    if (!user.password) {
      return res.status(401).json({ detail: 'Invalid credentials (password not set).' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ detail: 'Invalid credentials (password mismatch).' });
    }

    // Check if profile exists (all required fields are populated)
    const profileExists = Boolean(user.name && user.age && user.department);

    res.json({ message: 'Login successful.', profileExists: profileExists });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ detail: 'Internal server error during login.' });
  }
});

module.exports = router;