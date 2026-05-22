const { Schema, default: mongoose } = require("mongoose")

const COLLECTION_NAME = 'message'
const DOCUMENT_NAME = 'message'

const MessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'conversation'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: String,
    media: {
        type: [{
            url: { type: String, required: true },
            type: { type: String, default: 'image' }
        }],
        default: []
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

MessageSchema.index({
    conversationId: 1,
    createdAt: -1
})

module.exports = mongoose.model(DOCUMENT_NAME, MessageSchema)