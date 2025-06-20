const express = require('express');
const router  = express.Router();
const { register, login, profile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddlewave');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);

module.exports = router;