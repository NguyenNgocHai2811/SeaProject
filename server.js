// Import các thư viện cần thiết
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Nạp các biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Kết nối tới cơ sở dữ liệu MongoDB
connectDB();

// Middleware để xử lý JSON body
app.use(express.json());

// Phục vụ các file tĩnh từ các thư mục cần thiết
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Định nghĩa các Routes API
app.use('/api/species', require('./routes/SpeciesRoute'));
app.use('/api/auth', require('./routes/authoRoute'));
app.use('/api/chat', require('./routes/chatRoute'));
// Tệp upload_fileRoute trống, nên không cần thêm vào

// Trang chủ mặc định - chuyển hướng đến trang đăng nhập
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Logic xử lý Socket.IO cho WebRTC (giữ nguyên)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Tham gia vào một phòng
  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining room ${room}`);
    socket.join(room);
    socket.to(room).emit('user-joined', socket.id);
  });

  // Chuyển tiếp tin nhắn offer
  socket.on('offer', (data) => {
    socket.to(data.room).emit('offer', data.offer);
  });

  // Chuyển tiếp tin nhắn answer
  socket.on('answer', (data) => {
    socket.to(data.room).emit('answer', data.answer);
  });

  // Chuyển tiếp ICE candidate
  socket.on('candidate', (data) => {
    socket.to(data.room).emit('candidate', data.candidate);
  });

  // Xử lý khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✔ Server is running on port ${PORT}`);
});
