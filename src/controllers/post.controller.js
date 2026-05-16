'use strict'

const { SuccessResponse } = require("../core/success.response")
const PostService = require("../services/post.service")

class PostController {

    createPost = async (req, res, next) => {

        const userId = req.user
        const { content } = req.body;
        const file = req.file

        new SuccessResponse({
            message: 'Create post successfully!',
            metadata: await PostService.createPost(userId, content, file)
        }).send(res)
    }

    getAllPostLatest = async (req, res, next) => {

        const userId = req.user
        const { page, limit } = req.query

        new SuccessResponse({
            message: 'Get latest post successfully',
            metadata: await PostService.getAllPostLatest(
                userId,
                {
                    page: page || 1,
                    limit: limit || 10
                }
            )
        }).send(res)
    }

    getAllHighlightPosts = async (req, res, next) => {

        const userId = req.user
        const { page, limit } = req.query

        new SuccessResponse({
            message: 'Get highlight post successfully!',
            metadata: await PostService.getHighlightsPost(
                userId,
                {
                    page: page || 1,
                    limit: limit || 10
                }
            )
        }).send(res)
    }

    getAllMyPost = async (req, res, next) => {

        const userId = req.user
        const { page, limit } = req.query

        new SuccessResponse({
            message: 'Get all my post successfully',
            metadata: await PostService.getAllMyPost(
                userId,
                {
                    page: page || 1,
                    limit: limit || 1
                }
            )
        }).send(res)
    }

    deleteMyPost = async (req, res, next) => {

        const userId = req.user
        const { postId } = req.params;

        new SuccessResponse({
            message: 'Delete post successfully!',
            metadata: await PostService.deleteMyPost(userId, postId)
        }).send(res)
    }

    reactionPost = async (req, res, next) => {

        const userId = req.user
        const { postId } = req.params

        new SuccessResponse({
            message: 'Reactions post successfully!',
            metadata: await PostService.reactionPost(userId, postId)
        }).send(res)
    }
}

module.exports = new PostController()