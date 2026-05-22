const { Schema, default: mongoose } = require("mongoose");

const COLLECTION_NAME = 'conversation'
const DOCUMENT_NAME = 'conversations'

const ConversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'message'
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(DOCUMENT_NAME, ConversationSchema)