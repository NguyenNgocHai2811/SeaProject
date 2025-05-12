const multer = require('multer');
const fs = require('fs');
const path = require('path')


const storage = multer.diskStorage({
    destination: function(req,file,callback){
        let destDir = 'uploads/';
        if(file.mimetype.startsWith('image/')){
            destDir = 'uploads/images/'
        } else{
            destDir = 'uploads/others/'
        }

        //tao thu muc neu chua ton tai
        if(!fs.existsSync(destDir)){
            fs.mkdirSync(destDir,{recursive:true});
        }
        callback(null,destDir)
    },
    filename: function(req,file,callback){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9); // tao ten file duy nhat
        const extension = path.extname(file.originalname);// lay phan mo rong duoi file
        callback(null, file.fieldname+ " - "+ uniqueSuffix + extension);
    }
});
const uploadCustomerStorage = multer({storage:storage})

module.exports = uploadCustomerStorage;