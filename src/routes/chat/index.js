'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helper/asyncHandler')
const conversationController = require('../../controllers/conversation.controller')
const router = express.Router()

router.use(authentication)

router.post('/conversation', asyncHandler(conversationController.startConversation))

module.exports = router