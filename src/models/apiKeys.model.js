'use strict'

const { Schema, default: mongoose } = require("mongoose")

const DOCUMENT_NAME = 'apiKeys'
const COLLECTION_NAME = 'apiKey'

const apiKeysSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

module.exports = mongoose.model(DOCUMENT_NAME, apiKeysSchema)