'use strict'

const redis = require("../config/redis.config")
const { BadRequestError } = require("../core/error.response")
const postsModel = require("../models/posts.model")
const { post } = require("../routes/post")
const { getInfoData, convertObjectIdMongoDB } = require("../utils")
const { getCache, setCache, delCacheByPattern, decrCache, incCache, getCount } = require("../utils/redis.utils")
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

        await delCacheByPattern('post:highlights:*')
        await delCacheByPattern('post:latest:*')
        await delCacheByPattern(`post:my-post:${userId}:*`)

        const authorData = await findUserById(newPost?.author)

        return {
            ...newPost.toObject(),
            author: getInfoData(authorData, ['_id', 'username', 'email']),
        }
    }

    static getAllPostLatest = async (userId, { page = 1, limit = 10 }) => {
        const cacheKey = `post:latest:p${page}:l${limit}`

        let results = await getCache(cacheKey)

        if (!results) {
            const skip = (page - 1) * limit

            const posts = await postsModel.find({ isDelete: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', '_id username avatar')
                .lean()

            console.log('post: ', posts)

            const totalPosts = await postsModel.countDocuments()

            const finalPosts = await Promise.all(posts.map(async (p) => {
                const delta = await redis.get(`post:reaction_count:${p._id}`);
                const commentDelta = await redis.get(`post:comment_count:${p?._id}`)

                return {
                    ...p,
                    reactionCount: Math.max(0, (p.reactionCount || 0) + (parseInt(delta) || 0)),
                    commentCount: Math.max(0, (p.commentCount || 0) + (parseInt(commentDelta) || 0))
                };
            }));

            results = {
                posts: finalPosts,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalElements: totalPosts,
                    totalPages: Math.ceil(totalPosts / limit)
                }
            }

            await setCache(cacheKey, results, 300)
            console.log(`[Cache] Set new cache for key: ${cacheKey}`);
        } else {
            console.log(`[Cache] Hit for key: ${cacheKey}`);
        }

        const postsWithReactStatus = results?.posts?.map(post => {
            return {
                ...post,
                isReact: post.reactions ? post.reactions.some(id => id.toString() === userId?.toString()) : false
            };
        });

        return {
            ...results,
            posts: postsWithReactStatus
        }
    }

    static getHighlightsPost = async (userId, { page = 1, limit = 10 }) => {
        const cacheKey = `post:highlights:p${page}:l${limit}`

        let results = await getCache(cacheKey)

        if (!results) {
            const skip = (page - 1) * limit

            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 5)

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
                .populate('author', '_id username avatar')
                .lean()

            const totalPosts = await postsModel.countDocuments({
                createdAt: { $gte: twoDaysAgo },
                isDelete: false
            })

            const finalPosts = await Promise.all(posts.map(async (p) => {
                const delta = await redis.get(`post:reaction_count:${p._id}`);
                const commentDelta = await redis.get(`post:comment_count:${p?._id}`)

                return {
                    ...p,
                    reactionCount: Math.max(0, (p.reactionCount || 0) + (parseInt(delta) || 0)),
                    commentCount: Math.max(0, (p.commentCount || 0) + (parseInt(commentDelta) || 0))
                };
            }));

            results = {
                posts: finalPosts,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalElements: totalPosts,
                    totalPages: Math.ceil(totalPosts / limit)
                }
            }

            await setCache(cacheKey, results, 300)
            console.log(`[Cache] Set new cache for key: ${cacheKey}`);
        } else {
            console.log(`[Cache] Hit for key: ${cacheKey}`);
        }

        const postsWithReactStatus = results?.posts.map(post => {
            return {
                ...post,
                isReact: post?.reactions ? post?.reactions?.some(id => id?.toString() === userId?.toString()) : false
            };
        });

        return {
            ...results,
            posts: postsWithReactStatus
        }
    }

    static getAllMyPost = async (userId, { page = 1, limit = 10 }) => {

        if (!userId) throw new BadRequestError('User not found!')

        const cacheKey = `post:my-post:${userId}:p${page}:l${limit}`

        let results = await getCache(cacheKey)

        if (!results) {
            const skip = (page - 1) * limit

            const filter = { author: userId, isDelete: false }

            const posts = await postsModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', '_id username avatar')
                .lean()

            const totalPosts = await postsModel.countDocuments(filter)

            const finalPosts = await Promise.all(posts.map(async (p) => {
                const delta = await redis.get(`post:reaction_count:${p._id}`);
                const commentDelta = await redis.get(`post:comment_count:${p?._id}`)

                return {
                    ...p,
                    reactionCount: Math.max(0, (p.reactionCount || 0) + (parseInt(delta) || 0)),
                    commentCount: Math.max(0, (p.commentCount || 0) + (parseInt(commentDelta) || 0))
                };
            }));

            results = {
                posts: finalPosts,
                pagination: {
                    currentPage: Number(page),
                    limit: Number(limit),
                    totalElements: totalPosts,
                    totalPages: Math.ceil(totalPosts / limit)
                }
            }

            await setCache(cacheKey, results, 300)
            console.log(`[Cache] Set new cache for key: ${cacheKey}`);
        } else {
            console.log(`[Cache] Hit for key: ${cacheKey}`);
        }

        const postsWithReactStatus = results?.posts.map(post => {
            return {
                ...post,
                isReact: post.reactions ? post.reactions.some(id => id.toString() === userId?.toString()) : false
            };
        });

        return {
            ...results,
            posts: postsWithReactStatus
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

        const cacheKey = `post:reaction_count:${postId}`

        if (isReact) {

            // updateData = {
            //     $pull: { reactions: userId },
            //     $inc: { reactionCount: -1 }
            // }

            updateData = { $pull: { reactions: userId } };
            await decrCache(cacheKey, 1)

        } else {

            // updateData = {
            //     $addToSet: { reactions: userId },
            //     $inc: { reactionCount: 1 }
            // }

            updateData = { $addToSet: { reactions: userId } };
            await incCache(cacheKey, 1)
        }

        const updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            updateData,
            { new: true }
        )

        if (updatedPost) {

            await Promise.all([
                delCacheByPattern('post:highlights:*'),
                delCacheByPattern('post:latest:*'),
                delCacheByPattern(`post:my-post:${updatedPost?.author}:*`),

                delCacheByPattern(`post:detail:*`)
            ])


        }

        const redisCount = await getCount(cacheKey)

        return {
            postId: updatedPost._id,
            isReacted: !isReact,
            reactionCount: updatedPost?.reactionCount
        }
    }

    static getPostById = async (userId, postId) => {
        if (!postId) throw new BadRequestError('Post not found!')

        if (!userId) throw new BadRequestError('User not found!')

        const cacheKey = `post:detail:${postId}`

        let post = await getCache(cacheKey)

        if (!post) {
            post = await postsModel.findById(postId)
                .populate('author', '_id username avatar')
                .lean()

            if (!post) throw new BadRequestError('Post not found!')

            if (post?.isDelete) throw new BadRequestError('Post has been deleted!')

            await setCache(cacheKey, post, 300)
        } else {
            console.log('Hit cache')
        }

        //get count cached by redis + count in DB
        const [commentCountDelta, reactionCountDelta] = await Promise.all([
            redis.get(`post:comment_count:${postId}`),
            redis.get(`post:reaction_count:${postId}`)
        ])

        const commentCount = Math.max(0, (post?.commentCount || 0) + (parseInt(commentCountDelta) || 0))
        const reactionCount = Math.max(0, (post?.reactionCount || 0) + (parseInt(reactionCountDelta) || 0))

        const isReact = await post.reactions ? post?.reactions?.some(id => id.toString() === userId.toString()) : false

        return {
            ...post,
            isReact,
            reactionCount,
            commentCount
        }
    }
}

module.exports = PostService