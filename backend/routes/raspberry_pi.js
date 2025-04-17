const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');

// Configuration for Raspberry Pi connection
// In a production environment, these would be environment variables
const RASPBERRY_PI_HOST = process.env.RASPBERRY_PI_HOST || 'http://localhost:5000';

/**
 * Send user data to Raspberry Pi for match processing
 * This endpoint will be called when a user logs in or updates their profile
 */
router.post('/send-user-data', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        // Fetch user data from database
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Prepare data to send to Raspberry Pi
        // In a real implementation, you would make an HTTP request to the Raspberry Pi
        // For now, we'll just simulate the request and response
        
        console.log(`Sending user data for ${userId} to Raspberry Pi at ${RASPBERRY_PI_HOST}`);
        
        // Simulate successful response
        return res.status(200).json({ 
            message: 'User data sent to Raspberry Pi for processing',
            success: true
        });
        
        /* 
        // Actual implementation would look like this:
        const response = await axios.post(`${RASPBERRY_PI_HOST}/process-user`, {
            userData: {
                id: user.UserID,
                name: user.name,
                department: user.department,
                preferredStudy: user.preferred_study,
                socializationPreference: user.socialization_preference,
                meetingPreference: user.meeting_preference,
                joinReason: user.join_reason,
                introvertScale: user.introvert_scale,
                discussionLevel: user.discussion_level,
                combinedText: user.combined_text,
                macAddress: user.mac
            }
        });
        
        return res.status(200).json(response.data);
        */
    } catch (error) {
        console.error('Error sending user data to Raspberry Pi:', error);
        return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

/**
 * Receive match results from Raspberry Pi
 * The Raspberry Pi will call this endpoint when it has generated matches
 */
router.post('/receive-matches', async (req, res) => {
    try {
        const { matches } = req.body;
        
        if (!matches || !Array.isArray(matches)) {
            return res.status(400).json({ message: 'Valid matches array is required' });
        }
        
        // Process each match
        const savedMatches = [];
        
        for (const match of matches) {
            const { user1Id, user2Id, score, proximityScore } = match;
            
            // Validate required fields
            if (!user1Id || !user2Id || typeof score !== 'number') {
                console.warn('Skipping invalid match data:', match);
                continue;
            }
            
            // Check if users exist
            const user1 = await User.findByPk(user1Id);
            const user2 = await User.findByPk(user2Id);
            
            if (!user1 || !user2) {
                console.warn(`One or both users not found for match: ${user1Id} - ${user2Id}`);
                continue;
            }
            
            // Check if the match already exists
            const existingMatch = await Match.findOne({
                where: {
                    user1Id: user1Id,
                    user2Id: user2Id
                }
            });
            
            if (existingMatch) {
                // Update existing match
                existingMatch.score = score;
                if (proximityScore !== undefined) {
                    existingMatch.proximityScore = proximityScore;
                }
                await existingMatch.save();
                savedMatches.push(existingMatch);
            } else {
                // Create new match
                const newMatch = await Match.create({
                    user1Id,
                    user2Id,
                    score,
                    proximityScore: proximityScore || 0
                });
                savedMatches.push(newMatch);
            }
        }
        
        return res.status(200).json({ 
            message: `Successfully processed ${savedMatches.length} matches`,
            matches: savedMatches
        });
    } catch (error) {
        console.error('Error processing matches from Raspberry Pi:', error);
        return res.status(500).json({ message: 'Error processing matches', error: error.message });
    }
});

/**
 * Endpoint for Raspberry Pi to send proximity data from IOT devices
 */
router.post('/proximity-data', async (req, res) => {
    try {
        const { proximityData } = req.body;
        
        if (!proximityData || !Array.isArray(proximityData)) {
            return res.status(400).json({ message: 'Valid proximity data array is required' });
        }
        
        // Process proximity data
        const results = [];
        
        for (const data of proximityData) {
            const { macAddress1, macAddress2, proximityScore } = data;
            
            if (!macAddress1 || !macAddress2 || typeof proximityScore !== 'number') {
                console.warn('Skipping invalid proximity data:', data);
                continue;
            }
            
            // Find users by MAC addresses
            const user1 = await User.findOne({ where: { mac: macAddress1 } });
            const user2 = await User.findOne({ where: { mac: macAddress2 } });
            
            if (!user1 || !user2) {
                console.warn(`Could not find users with MAC addresses: ${macAddress1} - ${macAddress2}`);
                continue;
            }
            
            // Update match with proximity score
            const match = await Match.findOne({
                where: {
                    user1Id: user1.UserID,
                    user2Id: user2.UserID
                }
            });
            
            if (match) {
                match.proximityScore = proximityScore;
                await match.save();
                results.push({
                    user1Id: user1.UserID,
                    user2Id: user2.UserID,
                    proximityScore
                });
            } else {
                // Create a potential match based on proximity
                const newMatch = await Match.create({
                    user1Id: user1.UserID,
                    user2Id: user2.UserID,
                    score: 0.5, // Default score
                    proximityScore
                });
                results.push({
                    user1Id: user1.UserID,
                    user2Id: user2.UserID,
                    proximityScore,
                    created: true
                });
            }
        }
        
        return res.status(200).json({
            message: `Successfully processed ${results.length} proximity updates`,
            results
        });
    } catch (error) {
        console.error('Error processing proximity data:', error);
        return res.status(500).json({ message: 'Error processing proximity data', error: error.message });
    }
});

/**
 * Request immediate match generation from Raspberry Pi
 */
router.post('/generate-matches', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        // In a real implementation, this would make a request to the Raspberry Pi
        // to trigger match generation immediately
        console.log(`Requesting immediate match generation for user ${userId} from Raspberry Pi`);
        
        // Simulate successful response
        return res.status(200).json({
            message: 'Match generation request sent to Raspberry Pi',
            success: true
        });
    } catch (error) {
        console.error('Error requesting match generation:', error);
        return res.status(500).json({ message: 'Error requesting match generation', error: error.message });
    }
});

module.exports = router;