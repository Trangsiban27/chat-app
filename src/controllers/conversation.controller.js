'use strict'

const { SuccessResponse } = require("../core/success.response")
const conversationModel = require("../models/conversation.model")
const ConversationService = require("../services/conversation.service")

class ConversationController {
    startConversation = async (req, res, next) => {
        const { recipientId } = req.body
        const senderId = req.user

        new SuccessResponse({
            message: 'Create conversation successfully',
            metadata: await ConversationService.CreateConversation(senderId, recipientId)
        }).send(res)
    }
}



module.exports = new ConversationController()