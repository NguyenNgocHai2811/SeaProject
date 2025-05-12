const express = require('express');
const path = require('path');
const {login,register} = require('../controllers/authController')
const uploadCustomerStorage = require('../controllers/uploadFileController')


// authencation middlewave
const authenticateToken = require('../middleware/authMiddlewave');
const router = express.Router();
//route index
//route toi 
router.post('/login', login)
router.post('/register', register)



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});
router.get('/upload',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/upload_file.html'))
})
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'))
})
router.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/register.html'))
})


//route uploadfile
router.post('/upload', uploadCustomerStorage.single('file'),(req,res)=>{
    if(!req.file){
        return res.status(400).send('no file uploaded');
    }
    res.send(`file upload to: ${req.file.path}`)
})
router.post('/uploads',uploadCustomerStorage.array('files',10), (req,res)=>{
    if(!req.files){
        return res.status(400).send('no file uploaded');
    }
    const filePaths = req.files.map(file => file.path);
    res.send(`file upload to:` + filePaths)
})

router.get('/api/profile', authenticateToken, (req, res) => {
   
    const userProfile = users.find(u => u.id === req.user.userId);
    if (!userProfile) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Chỉ trả về thông tin an toàn
    res.json({
        userId: userProfile.id,
        username: userProfile.username
        // Thêm các thông tin khác nếu có
    });
});

module.exports = router
