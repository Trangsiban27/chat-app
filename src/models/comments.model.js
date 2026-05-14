'use strict'

const { default: mongoose, Schema } = require("mongoose")

const COLLECTION_NAME = 'comment'
const DOCUMENT_NAME = 'comments'

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = new mongoose.model(DOCUMENT_NAME, commentSchema)