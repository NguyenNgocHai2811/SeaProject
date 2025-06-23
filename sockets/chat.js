const Message = require('../model/Message');

module.exports = (io) => {
  io.on('connection', socket => {
    socket.on('joinRoom', roomId => socket.join(roomId));

    socket.on('chatMessage', async ({ roomId, user, text }) => {
      const msg = await Message.create({ roomId, user, text });
      io.to(roomId).emit('newMessage', msg);
    });

    socket.on('typing', ({ roomId, user }) => {
      socket.to(roomId).emit('userTyping', user);
    });
  });
};