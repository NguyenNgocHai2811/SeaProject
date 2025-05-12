// middleware/authMiddleware.js

const jwt = require('jsonwebtoken'); // <-- Đã thêm require
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// !! CẢNH BÁO: Key này PHẢI GIỐNG HỆT key trong authController.js !!
// !! Nên chuyển vào file .env !!


const authenticateToken = (req, res, next) => {
    // Lấy token từ header 'Authorization: Bearer TOKEN'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách lấy phần token

    // Nếu không có token
    if (token == null) {
        console.log("Middleware: No token provided.");
        // 401 Unauthorized - Yêu cầu cần xác thực
        return res.status(401).json({ message: 'Token không được cung cấp' });
    }

    // Xác thực token
    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        // Nếu token không hợp lệ hoặc hết hạn
        if (err) {
            console.error("Middleware: Lỗi xác thực token:", err.message);
            // 403 Forbidden - Token không hợp lệ hoặc hết hạn, không có quyền truy cập
            if (err.name === 'TokenExpiredError') {
                 return res.status(403).json({ message: 'Token đã hết hạn' });
            }
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }

        // Token hợp lệ! Lưu thông tin user từ payload vào đối tượng request
        // để các route handler sau có thể sử dụng
        console.log("Middleware: Token hợp lệ cho user:", userPayload);
        req.user = userPayload; // Gắn payload vào req.user
        next(); // Cho phép request đi tiếp tới route handler tiếp theo
    });
};

module.exports = authenticateToken;
