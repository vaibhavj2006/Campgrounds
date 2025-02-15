const cloudinary=require('cloudinary').v2;
const { CloudinaryStorage } =require('multer-storage-cloudinary')

cloudinary.config({
   cloud_name:process.env.c_name,
   api_key: process.env.c_key,
   api_secret: process.env.c_secret
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'campgrounds',
    allowedFormat:['jpeg','png','jpg']
}
});

module.exports={
    cloudinary,
    storage
}