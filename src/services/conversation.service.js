'use strict'

const { BadRequestError } = require("../core/error.response")
const conversationModel = require("../models/conversation.model")

class ConversationService {

    static CreateConversation = async (senderId, recipientId) => {
        if (!senderId) throw new BadRequestError('Missing senderId!')

        if (!recipientId) throw new BadRequestError('Missing recipientId!')

        let conversation = await conversationModel.findOne({
            isGroup: false,
            participants: { $all: [senderId, recipientId] }
        }).populate('participants', 'username avatar');

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, recipientId],
                isGroup: false
            })

            conversation = await conversation.populate('participants', 'username avatar')
        }

        return conversation
    }
}

module.exports = ConversationService