'use strict'

const { BadRequestError } = require("../core/error.response")
const conversationModel = require("../models/conversation.model")
const { convertObjectIdMongoDB } = require("../utils")

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

    static getConversationList = async (userId, lastId, limit = 10) => {
        if (!userId) throw new BadRequestError('User not found!')

        const query = {
            participants: userId,
        }

        if (lastId) {
            query._id = { $lt: convertObjectIdMongoDB(lastId) }
        }

        const conversations = await conversationModel.find(query)
            .populate('participants', '_id username avatar')
            .populate({
                path: 'lastMessage',
                select: 'text senderId'
            })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean()

        const hasMore = conversations?.length === limit
        const nextCursor = hasMore ? conversations[conversations?.length - 1] : null

        return {
            conversations: conversations || [],
            hasMore,
            nextCursor
        }
    }
}

module.exports = ConversationService