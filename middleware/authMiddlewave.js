// Ví dụ: Tạo file middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'day-la-mot-chuoi-bi-mat-rat-kho-doan-thay-doi-sau-nay'; // Phải giống key ở controller

const authenticateToken = (req, res, next) => {
    // Lấy token từ header 'Authorization: Bearer TOKEN'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token

    if (token == null) {
        // Nếu không có token, từ chối truy cập
        return res.sendStatus(401); // Unauthorized
    }

    // Xác thực token
    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            // Nếu token không hợp lệ hoặc hết hạn
            console.error("Lỗi xác thực token:", err.message);
            return res.sendStatus(403); // Forbidden
        }

        // Token hợp lệ, lưu thông tin user từ payload vào request
        req.user = userPayload; // Giờ đây các route handler sau có thể truy cập req.user
        next(); // Cho phép request đi tiếp tới route handler
    });
};

module.exports = authenticateToken;