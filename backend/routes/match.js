const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/User');
const PresenceLog = require('../models/PresenceLog');
const { generateMatches } = require('../utils/match_generation');

const router = express.Router();

router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // 1. Get User's MAC Address
    const user = await User.findOne({ where: { UserID: user_id } });
    if (!user) {
      return res.status(404).json({ detail: 'User profile not found.' });
    }
    if (!user.mac) {
      console.log(`User ${user_id} has no MAC address registered.`);
      return res.json([]); // Return empty if no MAC address is registered
    }
    const userMac = user.mac;

    // 2. Find User's Locations
    const userPresence = await PresenceLog.findAll({
      where: { mac: userMac }
    });

    if (userPresence.length === 0) {
      console.log(`User ${user_id} (MAC: ${userMac}) not found in presence logs.`);
      return res.json([]); // Return empty array if no locations found
    }

    const userLocations = [...new Set(userPresence.map(log => log.location))];

    // 3. Find Other Users in Same Locations
    const matchedPresence = await PresenceLog.findAll({
      where: { location: { [Op.in]: userLocations } }
    });

    const matchedMacs = [...new Set(matchedPresence.map(log => log.mac))];

    // 4. Filter Users based on MAC addresses and exclude the current user
    const candidateUsers = await User.findAll({
      where: {
        mac: { [Op.in]: matchedMacs },
        UserID: { [Op.not]: user_id } // Exclude current user
      }
    });

    if (candidateUsers.length === 0) {
      console.log(`No other users found in the same locations as ${user_id}.`);
      return res.json([]); // No potential matches found nearby
    }

    // 5. Generate Matches based on Profile Similarity
    const allUsersForMatching = [user, ...candidateUsers]; 
    const matches = generateMatches(allUsersForMatching);

    // 6. Filter matches to only include those involving the requesting user
    const result = [];
    for (const match of matches) {
      if (match.user1Id === user_id) {
        result.push({
          matched_with: match.user2Id,
          score: parseFloat(match.score.toFixed(3))
        });
      } else if (match.user2Id === user_id) {
        result.push({
          matched_with: match.user1Id,
          score: parseFloat(match.score.toFixed(3))
        });
      }
    }

    // 7. Sort results by score descending
    result.sort((a, b) => b.score - a.score);

    res.json(result);

  } catch (err) {
    console.error('Error getting matches:', err);
    res.status(500).json({ detail: 'An unexpected internal error occurred while finding matches.' });
  }
});

module.exports = router;