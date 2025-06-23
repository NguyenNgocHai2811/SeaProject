const express = require('express');
const { getRooms, joinRoom, getHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddlewave');

const router = express.Router();

router.get('/rooms',                       getRooms);
router.post('/rooms/:roomId/join',         joinRoom);
router.get('/rooms/:roomId/messages',      getHistory);

module.exports = router;
