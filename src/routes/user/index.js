'use strict'

const express = require('express')
const asyncHandler = require('../../helper/asyncHandler')
const userController = require('../../controllers/user.controller')
const router = express.Router()
const upload = require('../../config/cloudinary')
const { authentication } = require('../../auth/authUtils')

router.use(authentication)

// router.post('/upload-avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar))

router.post('/upload-avatar', authentication, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) {
            console.error('--- CLOUDINARY ERROR ---', err); // Xem lỗi thật ở đây
            return res.status(500).json({
                message: 'Cloudinary Upload Error',
                detail: err.message // Nó sẽ hiện "Invalid API Key" hoặc "Cloud name not found"
            });
        }
        next();
    });
}, asyncHandler(userController.uploadAvatar));

router.patch('/update-profile', asyncHandler(userController.updateUserProfile))

module.exports = router