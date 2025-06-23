const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
