// routes/authoRoute.js

const express = require('express');
// const path = require('path'); // Không thực sự cần ở đây nếu không dùng path.join

// Import controller functions và users (CẦN EXPORT TỪ CONTROLLER)
const { login, register, users } = require('../controllers/authController');

// Import middleware và controller upload
// Đảm bảo tên file là 'authMiddlewave.js' nếu file của bạn thực sự tên như vậy
const authenticateToken = require('../middleware/authMiddlewave');
const uploadCustomerStorage = require('../controllers/uploadFileController');

const router = express.Router();

// --- Auth API Routes ---
// POST /api/login
router.post('/login', login);

// POST /api/register
router.post('/register', register);

// --- Profile API Route (Protected) ---
// GET /api/profile
// !!!!! THÊM authenticateToken VÀO ĐÂY !!!!!
router.get('/profile', authenticateToken, (req, res) => {
    // Middleware đã chạy, req.user chứa payload { userId, username }

    // Kiểm tra phòng vệ xem req.user và req.user.userId có tồn tại không
    if (!req.user || typeof req.user.userId === 'undefined') {
        console.error("API /api/profile: req.user hoặc req.user.userId bị thiếu sau authenticateToken. Payload:", req.user);
        return res.status(403).json({ message: "Thông tin người dùng không hợp lệ trong token." });
    }

    const userProfile = users.find(u => u.id === req.user.userId);

    if (!userProfile) {
         console.warn(`API /api/profile: User với ID ${req.user.userId} từ token không tìm thấy trong mảng 'users'.`);
         // Trả về thông tin từ token nếu user không có trong mảng (ví dụ server restart)
         return res.json({
             userId: req.user.userId,
             username: req.user.username
             // message: "Dữ liệu người dùng có thể chưa đầy đủ." // Thông báo tùy chọn
         });
    }

    // Trả về thông tin an toàn
    res.json({
        userId: userProfile.id,
        username: userProfile.username
    });
});


// --- Upload Routes (Vẫn giữ authenticateToken nếu bạn muốn bảo vệ chúng) ---
router.post('/upload', uploadCustomerStorage.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({ message: 'File uploaded successfully', filePath: req.file.path });
});

router.post('/uploads', authenticateToken, uploadCustomerStorage.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const filePaths = req.files.map(file => file.path);
    res.status(201).json({ message: 'Files uploaded successfully', filePaths: filePaths });
});

module.exports = router;
