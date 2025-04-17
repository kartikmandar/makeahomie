const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const {
      name,
      UserID,
      age,
      gender,
      department,
      preferred_study,
      socialization_preference,
      meeting_preference,
      join_reason,
      introvert_scale,
      discussion_level,
      mac
    } = req.body;

    // Create combined text for matching algorithm
    const combined_text = `${name} is from ${department} department. They prefer ${preferred_study} study and are ${socialization_preference} in socializing. They prefer ${meeting_preference} meetings. Their reason for joining: ${join_reason}`;

    // Find the user by UserID
    const user = await User.findOne({ where: { UserID } });

    if (!user) {
      return res.status(404).json({ detail: 'User not found.' });
    }

    // Update the user's profile
    await user.update({
      name,
      age,
      gender,
      department,
      preferred_study,
      socialization_preference,
      meeting_preference,
      join_reason,
      introvert_scale,
      discussion_level,
      combined_text,
      mac: mac || "" // Ensure mac is not undefined
    });

    res.json({ message: 'Profile submitted successfully.' });

  } catch (err) {
    console.error('Error submitting profile:', err);
    res.status(500).json({ detail: 'An internal error occurred submitting the profile.' });
  }
});

// Update MAC address separately
router.post('/update-mac', async (req, res) => {
  try {
    const { userId, mac } = req.body;
    
    const user = await User.findOne({ where: { UserID: userId } });
    
    if (!user) {
      return res.status(404).json({ detail: 'User not found.' });
    }
    
    await user.update({ mac });
    
    res.json({ message: 'MAC address updated successfully.' });
    
  } catch (err) {
    console.error('Error updating MAC address:', err);
    res.status(500).json({ detail: 'Internal error updating MAC address.' });
  }
});

module.exports = router;