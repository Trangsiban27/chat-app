'use strict'

const { default: mongoose } = require("mongoose")

const COLLECTION_NAME = 'post'
const DOCUMENT_NAME = 'posts'

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media: [{
        url: String,
        public_id: String
    }],
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }],
    reactionCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

postSchema.index({ createdAt: -1 })

module.exports = mongoose.model(DOCUMENT_NAME, postSchema)