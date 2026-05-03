const mongooes = require('mongoose')

const COLLECTION_NAME = 'keyToken'
const DOCUMENT_NAME = 'keyTokens'

const keyTokenSchema = new mongooes.Schema({
    user: {
        type: mongooes.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = mongooes.model(DOCUMENT_NAME, keyTokenSchema)