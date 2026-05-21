'use strict'

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const MessageService = require("../services/messageService")

class MessageController {
    static getMessageByConversation = async (req, res, next) => {

        const { conversationId } = req.params
        const { lastId, limit } = req.query

        new SuccessResponse({
            message: 'Get message successfully',
            metadata: await MessageService.getMessageByConversation(conversationId, lastId, limit)
        }).send(res)
    }

    static uploadMessageFile = async (req, res, next) => {

        if (!req.file) {
            throw new BadRequestError('File not found!')
        }

        const fileData = await MessageService.uploadFile(req.file)

        new SuccessResponse({
            message: 'Upload successfully!',
            metadata: fileData
        }).send(res)
    }
}

module.exports = MessageController