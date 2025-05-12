// routes/authoRoute.js

const express = require('express');
const path = require('path'); // Vẫn cần path nếu có logic liên quan đến đường dẫn ở đây

// Import controller functions và users (CẦN EXPORT TỪ CONTROLLER)
const { login, register, users } = require('../controllers/authController'); // Giả sử users được export

// Import middleware và controller upload
const authenticateToken = require('../middleware/authMiddlewave'); // Đảm bảo tên file đúng
const uploadCustomerStorage = require('../controllers/uploadFileController');

const router = express.Router();

// --- Auth API Routes ---
// POST /api/login (do đã gắn prefix /api trong server.js)
router.post('/login', login);

// POST /api/register
router.post('/register', register);

// --- Profile API Route (Protected) ---
// GET /api/profile
router.get('/profile', authenticateToken, (req, res) => {
    // Middleware đã chạy, req.user chứa payload { userId, username }

    // Tìm user dựa trên userId từ token payload
    // Lưu ý: Biến 'users' cần được import hoặc truy cập đúng cách
    const userProfile = users.find(u => u.id === req.user.userId);

    if (!userProfile) {
        // Nếu user không tìm thấy trong mảng tạm thời (có thể do server restart)
        // Trả về thông tin từ token là đủ an toàn.
         console.warn(`User with ID ${req.user.userId} from valid token not found in 'users' array.`);
         return res.json({
             userId: req.user.userId,
             username: req.user.username
             // Không cần gửi message lỗi ở đây trừ khi thực sự cần thiết
         });
    }

    // Trả về thông tin an toàn (không bao gồm password hash)
    res.json({
        userId: userProfile.id,
        username: userProfile.username
        // Thêm các thông tin khác nếu cần (ví dụ: email, ngày tham gia...)
    });
});


// --- Upload Routes (Ví dụ - có thể tách ra file riêng) ---
// POST /api/upload (bảo vệ bằng token)
router.post('/upload', authenticateToken, uploadCustomerStorage.single('file'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({ message: 'No file uploaded' }); // Trả về JSON
    }
    // Trả về đường dẫn hoặc thông tin file dưới dạng JSON
    res.status(201).json({ message: 'File uploaded successfully', filePath: req.file.path });
})

// POST /api/uploads (bảo vệ bằng token)
router.post('/uploads', authenticateToken, uploadCustomerStorage.array('files',10), (req,res)=>{
    if(!req.files || req.files.length === 0){
        return res.status(400).json({ message: 'No files uploaded' }); // Trả về JSON
    }
    const filePaths = req.files.map(file => file.path);
    // Trả về mảng đường dẫn hoặc thông tin file dưới dạng JSON
    res.status(201).json({ message: 'Files uploaded successfully', filePaths: filePaths });
})

module.exports = router;
