'use strict'

const { BadRequestError } = require("../core/error.response")
const keyTokenModel = require("../models/keyToken.model")
const { convertObjectIdMongoDB } = require("../utils")

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

        try {
            const filter = { user: convertObjectIdMongoDB(userId) }

            const update = {
                privateKey,
                publicKey,
                refreshToken,
                refreshTokenUsed: [],
            }

            const options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )

            return tokens ? tokens.publicKey : null
        } catch (err) {
            console.log('err: ', err)
        }
    }

    static findKeyByUserId = async (userId) => {

        if (!userId) throw new BadRequestError('UserId not  found!')

        return await keyTokenModel.findById(convertObjectIdMongoDB(convertObjectIdMongoDB))
    }

    static deleteKeyStoreById = async (keyId) => {
        if (!keyId) throw new BadRequestError('Key not found!')

        return await keyTokenModel.deleteOne({
            _id: convertObjectIdMongoDB(keyId)
        }).lean()
    }
}

module.exports = KeyTokenService 