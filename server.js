// server.js

// Require các module cần thiết
const express = require('express');
const path = require('path');


// Require router và middleware
const apiRouter = require('./routes/authoRoute'); // Sử dụng tên file route của bạn
const authenticateToken = require('./middleware/authMiddlewave');

if(!authenticateToken){
    console.log("err")
}

const app = express();
const PORT = process.env.PORT || 3000; // Sử dụng cổng từ .env hoặc mặc định 3000

// Middleware cơ bản
app.use(express.json()); // Để parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Để parse URL-encoded bodies (nếu dùng form thường)

// Phục vụ file tĩnh (CSS, JS client-side, images) từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Gắn Router API vào prefix /api ---
// Tất cả các route trong authRoute.js sẽ bắt đầu bằng /api
// Ví dụ: /api/login, /api/register, /api/profile
app.use('/api', apiRouter);


// --- Các Route phục vụ trang HTML tĩnh ---

// Trang chủ (ví dụ)
app.get('/', (req, res) => {
    // Gửi file index.html từ thư mục views
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Trang đăng nhập
app.get('/login', (req, res) => {
    // Gửi file login.html từ thư mục views
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Trang đăng ký
app.get('/register', (req, res) => {
    // Gửi file register.html từ thư mục views
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

 // Trang upload file (Ví dụ - nếu bạn có trang này)
 app.get('/upload', (req, res) => {
     // Gửi file upload_file.html từ thư mục views
     res.sendFile(path.join(__dirname, 'views', 'upload_file.html'));
 });

// Trang Profile (Cần bảo vệ bằng middleware)
app.get('/profile', authenticateToken, (req, res) => {
    // Middleware authenticateToken đã chạy và xác thực token thành công
    // Chỉ người dùng đã đăng nhập mới thấy được trang này
    // Gửi file profile.html từ thư mục views
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Middleware xử lý lỗi cơ bản (nên đặt cuối cùng)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send('Something broke on the server!');
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
