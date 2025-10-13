const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static('public'));

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
    // Thông báo cho những người dùng khác trong các phòng mà socket này đã tham gia
    // (Trong ví dụ đơn giản này, chúng ta không xử lý việc rời phòng cụ thể)
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
