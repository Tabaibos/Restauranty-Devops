const cloudinary = require('cloudinary');       // módulo completo, sem .v2
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = cloudinaryStorage({
    cloudinary,   // passa o módulo completo, não .v2
    params: {
        allowed_formats: ['png', 'jpeg', 'jpg'],
        folder: 'restaurant'
    }
});

module.exports = multer({ storage });