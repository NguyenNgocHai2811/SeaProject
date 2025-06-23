const Message = require('../model/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // join a specific chat room
    socket.on('joinRoom', (roomId) => socket.join(roomId));

    // handle incoming chat message
    socket.on('chatMessage', async ({ roomId, user, text }) => {
      const msg = await Message.create({ roomId, user, text });
      io.to(roomId).emit('newMessage', msg);
    });

    // typing indicator
    socket.on('typing', ({ roomId, user }) => {
      socket.to(roomId).emit('userTyping', user);
    });
  });
};
