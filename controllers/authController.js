
// controllers/authController.js
const jwt = require('jsonwebtoken');

// !! CẢNH BÁO: Key này CHỈ DÙNG ĐỂ VÍ DỤ. Trong thực tế PHẢI dùng biến môi trường !!
const JWT_SECRET = 'haideptrai123';



const users = [];

const register = (req,res)=>{
    const {username, password} = req.body;
// kiem tra neu username ton tai
const existingUser = users.find((user)=>{
    return user.username == username
})
if(existingUser){
    return res.status(400).json({message:'Username da ton tai'})
}

// luu user vao database
const newUser = {username,password}
users.push(newUser);
return res.status(201).json({message: 'dang ky thanh cong',newUser})
};

// xu li route login
const login = (req,res)=>{
    const {username,password} = req.body;
    const user = users.find((user)=>{
        return user.username == username && user.password == password;
    })
    if(!user){
        return res.status(401).json({message: 'sai username va password'});
    }
    //tao JWT
    const payLoad={
        username: user.username,
        userId: user.id
    }
    //ky va tao token
    try{
        const token = jwt.sign(
            payLoad,
            JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.status(200).json({
            message: 'Dang nhap thanh cong',
            token: token
        });
    } catch(error){
        console.error('lỗi tạo token',error);
        return res.status(500).json({message: 'Lỗi server khi tạo token'})
    }
    //dang nhap thanh cong
    return res.status(200).json({message: 'dang nhap thanh cong',user})
};
module.exports ={
    register,
    login
}

