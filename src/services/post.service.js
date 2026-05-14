'use strict'

const { BadRequestError } = require("../core/error.response")
const postsModel = require("../models/posts.model")
const { post } = require("../routes/post")
const { getInfoData, convertObjectIdMongoDB } = require("../utils")
const { findUserById } = require("./user.service")

class PostService {

    static findPostById = async (postId) => {
        if (!postId) throw new BadRequestError('Post not found!')

        return await postsModel.findById(convertObjectIdMongoDB(postId))
    }

    static createPost = async (userId, content, file) => {
        if (!userId) throw new BadRequestError('User not found!')

        if (!content && !file) throw new BadRequestError("The post must have content!")

        let mediaData = []

        if (file) {
            mediaData.push({
                url: file.path,
                public_id: file.filename
            })
        }

        const newPost = await postsModel.create({
            author: userId,
            content,
            media: mediaData,
        })

        if (!newPost) throw new BadRequestError('Create post fail!')

        console.log('newPost: ', newPost)

        const authorData = await findUserById(newPost?.author)

        return {
            ...newPost.toObject(),
            author: getInfoData(authorData, ['_id', 'username', 'email']),
        }
    }

    static getAllPostLatest = async ({ page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit

        const posts = await postsModel.find({ isDelete: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const totalPosts = await postsModel.countDocuments()

        return {
            posts,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalElements: totalPosts,
                totalPages: Math.ceil(totalPosts / limit)
            }
        }
    }

    static getHighlightsPost = async ({ page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit

        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        const posts = await postsModel.find({
            createdAt: { $gte: twoDaysAgo },
            isDelete: false
        })
            .sort({
                reactionCount: -1,
                commentCount: -1,
                createdAt: -1
            })
            .skip(skip)
            .limit(limit)
            .lean()

        const totalPosts = await postsModel.countDocuments({
            createdAt: { $gte: twoDaysAgo },
            isDelete: false
        })

        return {
            posts,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalElements: totalPosts,
                totalPages: Math.ceil(totalPosts / limit)
            }
        }
    }

    static getAllMyPost = async (userId, { page = 1, limit = 10 }) => {

        if (!userId) throw new BadRequestError('User not found!')

        const skip = (page - 1) * limit

        const filter = { author: userId, isDelete: false }

        const posts = await postsModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const totalPosts = await postsModel.countDocuments(filter)

        return {
            posts,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalElements: totalPosts,
                totalPages: Math.ceil(totalPosts / limit)
            }
        }
    }

    static deleteMyPost = async (userId, postId) => {
        if (!userId) throw new BadRequestError('User not found!')

        if (!postId) throw new BadRequestError('Post not found!')

        const post = await this.findPostById(postId)

        if (!post) throw new BadRequestError('Post not found!')

        if (post.author.toString() !== userId.toString()) {
            throw new BadRequestError('You do not allow permission to delete this post!')
        }

        const updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            {
                $set: {
                    isDelete: true,
                    deletedAt: new Date()
                }
            },
            { new: true }
        )

        if (!updatedPost) throw new BadRequestError('Deleted post failed!')

        return {
            postId,
            status: 'Delete successfully'
        }
    }

    static reactionPost = async (userId, postId) => {
        if (!userId) throw new BadRequestError('User not found!')
        if (!postId) throw new BadRequestError('Post not found!')

        const post = await this.findPostById(convertObjectIdMongoDB(postId))

        if (!post) throw new BadRequestError('Post not found!')

        if (post.isDelete) throw new BadRequestError('Invalid request!')

        const isReact = post.reactions.includes(userId)

        let updateData = {}

        if (isReact) {

            updateData = {
                $pull: { reactions: userId },
                $inc: { reactionCount: -1 }
            }
        } else {

            updateData = {
                $addToSet: { reactions: userId },
                $inc: { reactionCount: 1 }
            }
        }

        const updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            updateData,
            { new: true }
        )

        return {
            postId: updatedPost._id,
            isReacted: !isReact,
            reactionCount: updatedPost.reactionCount
        }
    }
}

module.exports = PostService