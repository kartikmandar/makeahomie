const express = require('express');
const PresenceLog = require('../models/PresenceLog');

const router = express.Router();

router.post('/log', async (req, res) => {
  try {
    const { mac, timestamp, location } = req.body;
    
    await PresenceLog.create({
      mac,
      timestamp: timestamp || new Date(),
      location
    });
    
    res.json({ message: 'Presence logged.' });
  } catch (err) {
    console.error('Error logging presence:', err);
    res.status(500).json({ detail: 'An internal error occurred logging presence.' });
  }
});

module.exports = router;