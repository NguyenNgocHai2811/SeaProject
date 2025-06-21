
const fs   = require('fs');
const path = require('path');
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { register, login } = require('../controllers/authController');
const { getProfile, updateAvatar } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddlewave');

// multer setup for avatars
const avatarsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   authMiddleware, getProfile);
// avatar upload
router.put('/profile/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

module.exports = router;