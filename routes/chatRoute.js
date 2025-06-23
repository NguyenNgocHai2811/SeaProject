const express = require('express');
const router = express.Router();
const Message = require('../model/Message');
const auth = require('../middleware/authMiddlewave');

// get chat history for a room
router.get('/history/:roomId', auth, async (req, res) => {
  try {
    const msgs = await Message.find({ roomId: req.params.roomId }).sort('timestamp');
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
