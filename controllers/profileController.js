const User = require('../model/User');
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/avatars/${req.file.filename}`;
  const user = await User.findById(req.user.id);
  user.avatarUrl = url;
  await user.save();
  res.json({ avatarUrl: url });
};
