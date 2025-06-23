// config/db.js
require('dotenv').config();          // Phải gọi trước khi dùng process.env
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,         // dùng parser mới
      useUnifiedTopology: true,      // động cơ mới, ổn định hơn
      serverSelectionTimeoutMS: 20000, // chờ tối đa 20s thay vì 30s mặc định
      socketTimeoutMS: 45000          // timeout cho socket I/O
    });
    console.log('✔ Connected to MongoDB');
  } catch (err) {
    console.error('✖ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
