'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const { BadRequestError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-refresh-token'
}

const createPairToken = async (payload, publicKey, privateKey) => {
    try {
        /*
            1 - Create pair token base on public key
            2 - Create pair token base on private key
            3 - verify token
        */

        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('err verify: ', err)
            } else {
                console.log('decode verify: ', decode)
            }
        })

        return {
            accessToken,
            refreshToken
        }

    } catch (err) {
        console.log('err: ', err)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing??
        2 - get accessToken
        3 - verify token
        4 - check user in db?
        5 - check keyStore with userId?
        6 - OK all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) throw new BadRequestError('Invalid request!')

    const keyStore = await KeyTokenService.findKeyByUserId(userId)

    if (!keyStore) throw new BadRequestError('Invalid user id')

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {

            const refreshToken = req.headers[HEADER.API_KEY]

            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

            if (decodeUser.userId !== userId) throw new BadRequestError('Invalid Request!')

            req.keyStore = keyStore
            req.user = userId
            req.refreshToken = refreshToken

            return next()
        } catch (err) {
            console.log('err: ', err)
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]

    if (!accessToken) throw new BadRequestError('Invalid request!')

    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

    if (decodeUser?.userId !== userId) throw new BadRequestError('Invalid request!')

    req.keyStore = keyStore
    req.user = userId

    return next()
})

module.exports = {
    createPairToken,
    authentication
}