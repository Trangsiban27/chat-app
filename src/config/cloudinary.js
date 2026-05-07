'use strict'
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'benegram_avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        // transformation: [
        //     {
        //         width: 500,
        //         height: 500,
        //         crop: 'limit', // Giới hạn kích thước tối đa 500px
        //         quality: 'auto', // Tự động tối ưu dung lượng
        //         fetch_format: 'auto' // Tự động chọn định dạng tốt nhất (như webp) cho trình duyệt
        //     }
        // ]
    }
})

const uploadCloud = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = uploadCloud