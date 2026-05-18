'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helper/asyncHandler')
const postController = require('../../controllers/post.controller')
const upload = require('../../config/cloudinary')
const router = express.Router()

router.use(authentication)

router.post('/', authentication, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('--- CLOUDINARY ERROR ---', err); // Xem lỗi thật ở đây
            return res.status(500).json({
                message: 'Cloudinary Upload Error',
                detail: err.message // Nó sẽ hiện "Invalid API Key" hoặc "Cloud name not found"
            });
        }
        next();
    });
}, asyncHandler(postController.createPost))

router.get('/latest', asyncHandler(postController.getAllPostLatest))
router.get('/highlights', asyncHandler(postController.getAllHighlightPosts))
router.get('/my-post', asyncHandler(postController.getAllMyPost))
router.delete('/:postId', asyncHandler(postController.deleteMyPost))
router.get('/reactions/:postId', asyncHandler(postController.reactionPost))
router.get('/:postId', asyncHandler(postController.getPostById))

module.exports = router