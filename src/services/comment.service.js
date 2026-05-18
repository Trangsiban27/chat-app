'use strict'

const { BadRequestError } = require("../core/error.response")
const commentsModel = require("../models/comments.model")
const { convertObjectIdMongoDB } = require("../utils")

class CommentService {

    static createComment = async (userId, { postId, parentId, content }) => {
        if (!userId) throw new BadRequestError('User not found!')

        console.log('postId: ', postId)

        if (!postId) throw new BadRequestError('Post not found!')

        const comment = new commentsModel({
            postId,
            author: userId,
            content,
            parentId
        })

        if (parentId && parentId !== null && parentId !== '') {
            const parentComment = await commentsModel.findById(parentId)

            if (!parentComment) throw new BadRequestError('Parent comment not found!')

            comment.postId = parentComment.postId
        }

        const saveComment = await comment.save()

        return saveComment
    }

    static getPostComments = async ({ postId, lastId, limit = 10 }) => {
        if (!postId) throw new BadRequestError('Post not found!')

        // const skip = (page - 1) * limit

        // const comments = await commentsModel.find({
        //     postId
        // })
        //     .sort({ createdAt: -1 })
        //     .skip(skip)
        //     .limit(limit)
        //     .populate('author', '_id username email')
        //     .lean()

        // if (!comments) throw new BadRequestError('Comments not found!')

        // const totalComments = await commentsModel.countDocuments()

        // return {
        //     comments,
        //     pagination: {
        //         currentPage: Number(page),
        //         limit: Number(limit),
        //         totalElements: totalComments,
        //         totalPages: Math.ceil(totalComments / limit)
        //     }
        // }

        const query = {
            postId: convertObjectIdMongoDB(postId),
            parentId: null,
            // isDelete: false
        }

        if (lastId) {
            query._id = { $lt: convertObjectIdMongoDB(lastId) }
        }

        const comments = await commentsModel.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .populate('author', '_id username avatar')
            .lean()

        const hasMore = comments.length === limit
        const nextCursor = hasMore ? comments[comments.length - 1]?._id : null

        return {
            comments: comments || [],
            nextCursor,
            hasMore
        }
    }

    static getCommentReplies = async ({ commentId, lastId, limit = 10 }) => {
        if (!commentId) throw new BadRequestError('Comment not found!')

        const query = {
            parentId: convertObjectIdMongoDB(commentId),
        }

        if (lastId) {
            query._id = { $lt: convertObjectIdMongoDB(lastId) }
        }

        const replies = await commentsModel.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .populate('author', '_id username avatar')
            .lean()

        const hasMore = replies.length === limit
        const nextCursor = hasMore ? replies[replies.length - 1]?._id : null

        return {
            replies: replies || [],
            hasMore,
            nextCursor
        }
    }
}

module.exports = CommentService