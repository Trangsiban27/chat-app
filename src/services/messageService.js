'use strict'

const { BadRequestError } = require("../core/error.response")
const messageModel = require("../models/message.model")
const { convertObjectIdMongoDB } = require("../utils")
const cloudinary = require('../config/cloudinary')

class MessageService {
    static getMessageByConversation = async (conversationId, lastId, limit = 10) => {

        if (!conversationId) throw new BadRequestError('Conversation not found!')

        const query = {
            conversationId
        }

        if (lastId) {
            query._id = { $lt: convertObjectIdMongoDB(lastId) }
        }

        const messageList = await messageModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', '_id username avatar')
            .lean()

        const hasMore = messageList?.length === Number(limit)
        const nextCursor = hasMore ? messageList[messageList?.length - 1] : null

        return {
            message: messageList,
            nextCursor,
            hasMore
        }
    }

    static uploadFile = async (file) => {
        if (!file) throw new BadRequestError('File is required!')

        const maxSize = 5 * 1024 * 1024

        if (file.size > maxSize) throw new BadRequestError('File too large! just allow maximum 5MB')

        try {

            return {
                url: file?.path,
                type: file.mimetype.split('/')[0]
            }


        } catch (err) {
            console.log('Upload fail: ', err)
            throw new BadRequestError('Upload to Cloudinary failed');
        }
    }
}

module.exports = MessageService