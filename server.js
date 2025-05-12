// server.js
require('dotenv').config(); // Nạp biến môi trường từ file .env

const express = require('express');
const path = require('path');
const apiRouter = require('./routes/authoRoute'); // Router cho các API
// const authenticateToken = require('./middleware/authMiddlewave'); // Không cần require ở đây nữa nếu chỉ dùng trong apiRouter

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares cơ bản
app.use(express.json()); // Để parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Để parse URL-encoded request bodies

// Phục vụ file tĩnh từ thư mục 'public' (CSS, JS client-side)
app.use(express.static(path.join(__dirname, 'public')));

// Gắn API router vào prefix /api
// Tất cả các route trong authoRoute.js sẽ có tiền tố /api
// Ví dụ: /api/login, /api/register, /api/profile
app.use('/api', apiRouter);

// --- Các Route phục vụ trang HTML tĩnh ---

// Trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Trang đăng nhập
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Trang đăng ký
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Trang upload file (ví dụ)
app.get('/uploadFile', (req, res) => {
     res.sendFile(path.join(__dirname, 'views', 'upload_file.html'));
 });

// Trang Profile (HTML) - KHÔNG cần authenticateToken ở đây
// Trang HTML sẽ được tải, sau đó script trên trang đó sẽ gọi API /api/profile (đã được bảo vệ)
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Middleware xử lý lỗi cơ bản (đặt cuối cùng)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send('Something broke on the server!');
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
