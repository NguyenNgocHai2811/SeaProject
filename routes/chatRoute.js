const express = require('express');
const { getRooms, joinRoom, getHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddlewave');

const router = express.Router();

router.get('/rooms',                      authMiddleware, getRooms);
router.post('/rooms/:roomId/join',        authMiddleware, joinRoom);
router.get('/rooms/:roomId/messages',     authMiddleware, getHistory);

module.exports = router;
