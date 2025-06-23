const ChatRoom = require('../model/chatRoom');
const Message  = require('../model/Message');

exports.getRooms = async (req, res) => {
  const rooms = await ChatRoom.find();
  res.json(rooms);
};

exports.joinRoom = async (req, res) => {
  const room = await ChatRoom.findById(req.params.roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  // ensure membership check works with ObjectId values
  const isMember = room.members.some(m => m.equals(req.user.id));
  if (!isMember) {
    room.members.push(req.user.id);
    await room.save();
  }
  res.json({ message: 'Joined room' });
};

exports.getHistory = async (req, res) => {
  const room = await ChatRoom.findById(req.params.roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
   const isMember = room.members.some(m => m.equals(req.user.id));
  if (!isMember) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const messages = await Message.find({ roomId: req.params.roomId })
    .sort('timestamp')
    .populate('sender', 'username avatarUrl');
  res.json(messages);
};
