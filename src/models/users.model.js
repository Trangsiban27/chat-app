'use strict'
const mongoose = require('mongoose')

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const userSchema = new mongoose.Schema({
    username: {
        required: [true, 'Username is required!'],
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalid!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    avatar: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    settings: {
        showOnlineStatus: {
            type: Boolean,
            default: true
        }
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(DOCUMENT_NAME, userSchema)