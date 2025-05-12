// controllers/authController.js

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // <-- Nên cài và sử dụng: npm install bcrypt

// !! CẢNH BÁO: Key này PHẢI GIỐNG HỆT key trong authMiddleware.js !!
// !! Nên chuyển vào file .env !!
const JWT_SECRET = process.env.JWT_SECRET; // <-- Đặt key bí mật CỦA BẠN ở đây (và trong middleware)

// Mảng tạm thời lưu user (sẽ mất khi server restart)
// Trong ứng dụng thực tế, bạn sẽ dùng database (MongoDB, PostgreSQL,...)
const users = [];
let userIdCounter = 1; // Biến đếm đơn giản để tạo ID

// --- Hàm Đăng ký ---
const register = async (req, res) => { // Thêm async nếu dùng bcrypt
    const { username, password } = req.body;

    // Kiểm tra input cơ bản
    if (!username || !password) {
        return res.status(400).json({ message: 'Username và password là bắt buộc' });
    }

    // Kiem tra neu username ton tai
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username da ton tai' });
    }

    // --- Nên mã hóa mật khẩu ---
    let hashedPassword = password; // Tạm thời chưa hash
    // try {
    //     const salt = await bcrypt.genSalt(10);
    //     hashedPassword = await bcrypt.hash(password, salt);
    // } catch (hashError) {
    //     console.error("Lỗi hash mật khẩu:", hashError);
    //     return res.status(500).json({ message: "Lỗi server khi xử lý đăng ký" });
    // }

    // Luu user vao "database" (mảng users)
    const newUser = {
        id: userIdCounter++, // Gán ID duy nhất
        username,
        password: hashedPassword // Lưu password (hoặc hash)
    };
    users.push(newUser);
    console.log("User đã đăng ký:", { id: newUser.id, username: newUser.username }); // Log thông tin an toàn

    // --- Không trả về password trong response ---
    const userForResponse = {
        id: newUser.id,
        username: newUser.username
    };
    return res.status(201).json({ message: 'Dang ky thanh cong', user: userForResponse });
};

// --- Hàm Đăng nhập ---
const login = async (req, res) => { // Thêm async nếu dùng bcrypt
    const { username, password } = req.body;

     // Kiểm tra input cơ bản
    if (!username || !password) {
        return res.status(400).json({ message: 'Username và password là bắt buộc' });
    }

    // Tìm user bằng username
    const user = users.find((user) => user.username === username);

    // Nếu không tìm thấy user
    if (!user) {
        return res.status(401).json({ message: 'Sai username hoac password' });
    }

    // --- Nên dùng bcrypt.compare ---
    // let isMatch = false;
    // try {
    //     isMatch = await bcrypt.compare(password, user.password);
    // } catch (compareError) {
    //      console.error("Lỗi so sánh mật khẩu:", compareError);
    //      return res.status(500).json({ message: "Lỗi server khi xử lý đăng nhập" });
    // }
    // if (!isMatch) {
    //     return res.status(401).json({ message: 'Sai username hoac password' });
    // }

    // Tạm thời so sánh trực tiếp (KHÔNG AN TOÀN)
    if (user.password !== password) {
         return res.status(401).json({ message: 'Sai username hoac password' });
    }

    // --- Tạo JWT Payload với thông tin cần thiết và không nhạy cảm ---
    const payLoad = {
        userId: user.id, // Lấy id đã gán
        username: user.username
        // Có thể thêm role hoặc thông tin khác nếu cần
    };

    // Ky va tao token
    try {
        const token = jwt.sign(
            payLoad,
            JWT_SECRET, // Sử dụng key bí mật đã định nghĩa
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ (có thể đổi)
        );
        // Trả về token cho client
        return res.status(200).json({
            message: 'Dang nhap thanh cong',
            token: token
        });
    } catch (error) {
        console.error('Lỗi tạo token JWT:', error);
        return res.status(500).json({ message: 'Lỗi server khi tạo token' });
    }
};

// Export các hàm và mảng users (tạm thời)
module.exports = {
    register,
    login,
    users // Export mảng users để router có thể truy cập (không phải cách tốt nhất cho production)
};
