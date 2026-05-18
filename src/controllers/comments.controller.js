'use strict'

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentsController {

    createComment = async (req, res, next) => {

        const userId = req.user

        new SuccessResponse({
            message: 'Comment successfully!',
            metadata: await CommentService.createComment(userId, req.body)
        }).send(res)
    }

    getComments = async (req, res, next) => {

        const { lastId, limit, postId } = req.query

        new SuccessResponse({
            message: 'Get comments of post successfully!',
            metadata: await CommentService.getPostComments(
                {
                    postId,
                    lastId,
                    limit: limit || 10
                }
            )
        }).send(res)
    }

    getCommentReplies = async (req, res, next) => {

        const { lastId, limit, commentId } = req.query

        new SuccessResponse({
            message: 'Get comment replies successfully!',
            metadata: await CommentService.getCommentReplies(
                {
                    commentId,
                    lastId,
                    limit
                }
            )
        }).send(res)
    }
}

module.exports = new CommentsController()