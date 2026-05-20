const { Schema, default: mongoose } = require("mongoose");

const COLLECTION_NAME = 'collection'
const DOCUMENT_NAME = 'collections'

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
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(DOCUMENT_NAME, ConversationSchema)