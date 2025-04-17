const express = require('express');
const { Op } = require('sequelize');
const Message = require('../models/Message');

const router = express.Router();

// Send Message
router.post('/send', async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const timestamp = new Date();

    await Message.create({
      sender_id,
      receiver_id,
      message,
      timestamp
    });

    res.json({ message: 'Message sent.' });

  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ detail: 'An internal error occurred sending the message.' });
  }
});

// Chat History
router.get('/history/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const chatHistory = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: user1, receiver_id: user2 },
          { sender_id: user2, receiver_id: user1 }
        ]
      },
      order: [['timestamp', 'ASC']]
    });

    res.json(chatHistory);

  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ detail: 'An internal error occurred fetching chat history.' });
  }
});

module.exports = router;