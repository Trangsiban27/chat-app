'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helper/asyncHandler')
const conversationController = require('../../controllers/conversation.controller')
const MessageController = require('../../controllers/message.controller')
const uploadCloud = require('../../config/cloudinary')
const router = express.Router()

router.use(authentication)

router.post('/conversation', asyncHandler(conversationController.startConversation))
router.get('/conversation', asyncHandler(conversationController.getConversationList))
router.get('/conversation/:conversationId/messages', asyncHandler(MessageController.getMessageByConversation))
router.post('/message/upload', uploadCloud.single('file'), asyncHandler(MessageController.uploadMessageFile))

module.exports = router