'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helper/asyncHandler')
const commentsController = require('../../controllers/comments.controller')
const router = express.Router()

router.use(authentication)

router.post('/', asyncHandler(commentsController.createComment))
router.get('/', asyncHandler(commentsController.getComments))
router.get('/replies', asyncHandler(commentsController.getCommentReplies))

module.exports = router