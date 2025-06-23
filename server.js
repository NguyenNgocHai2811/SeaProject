require('dotenv').config(); // Nạp biến môi trường
const authMiddleware = require('./middleware/authMiddlewave');
const express = require('express');
const path = require('path');
 const connectDB = require('./config/db')
const apiRouter = require('./routes/authoRoute');
const speciesRoute = require('./routes/SpeciesRoute'); 
const chatRoutes = require('./routes/chatRoute');

const http    = require('http');            // thêm
const { Server } = require('socket.io');   // thêm
const jwt     = require('jsonwebtoken');    

const app = express();
const PORT = process.env.PORT || 3000;
connectDB()
const server = http.createServer(app);
const io = new Server(server)


// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Routes API
app.use('/api', apiRouter);
app.use('/api/species', speciesRoute); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/chat', chatRoutes);


// Routes HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/uploadFile', (req, res) => res.sendFile(path.join(__dirname, 'views', 'upload_file.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
app.get('/species', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'species.html'));});
app.get('/add-species', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'add_species.html'));});
app.get('/rooms', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'rooms.html'));
});
// sau cùng, trước error middleware:
app.get('/chat',authMiddleware ,(req, res) => {res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});



// Middleware lỗi
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send('Something broke on the server!');
});


// middleware để xác thực JWT qua cookie hoặc header
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload; 
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});
io.on('connection', socket => {
  socket.on('joinRoom', async roomId => {
    const ChatRoom = require('./model/chatRoom');
    const room = await ChatRoom.findById(roomId);
    if (room && room.members.includes(socket.user.id)) {
      socket.join(roomId);
    }
  });

  socket.on('sendMessage', async ({ roomId, text }) => {
    const ChatRoom = require('./model/chatRoom');
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.members.includes(socket.user.id)) {
      return;
    }
    const Message = require('./model/Message');
    const msg = await Message.create({
      roomId,
      sender: socket.user.id,
      text
    });
    io.to(roomId).emit('newMessage', {
      _id: msg._id,
      roomId,
      sender: { _id: socket.user.id },
      text: msg.text,
      timestamp: msg.timestamp
    });
  });
});

server.listen(PORT, () => console.log(`Server on ${PORT}`));

