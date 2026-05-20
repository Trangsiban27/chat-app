const { Schema, default: mongoose } = require("mongoose")

const COLLECTION_NAME = 'message'
const DOCUMENT_NAME = 'messages'

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
    media: [{
        url: String,
        type: String,
    }],
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(DOCUMENT_NAME, MessageSchema)