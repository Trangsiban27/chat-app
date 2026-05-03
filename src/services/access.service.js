'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { BadRequestError } = require("../core/error.response")
const KeyTokenService = require("./keyToken.service")
const UserService = require("./user.service")
const usersModel = require('../models/users.model')
const { createPairToken } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

class AccessService {

    static logout = async (keyStore) => {

        const delKey = await KeyTokenService.deleteKeyStoreById(keyStore._id)

        return delKey
    }

    static signUp = async ({ username, email, password }) => {

        const foundEmail = await UserService.findUserByEmail(email)

        if (foundEmail) throw new BadRequestError('Email already exists!')

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await usersModel.create({
            username,
            email,
            password: passwordHash
        })

        if (newUser) {

            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser?._id,
                publicKey,
                privateKey
            })

            if (!keyStore) throw new BadRequestError('Failed to create keystore')

            const tokens = await createPairToken(
                {
                    userId: newUser?._id,
                    email,
                },
                publicKey,
                privateKey
            )

            if (!tokens) throw new BadRequestError('Failed to create tokens')

            return {
                code: 201,
                metadata: {
                    user: getInfoData(newUser, ['_id', 'name', 'email']),
                    tokens
                }
            }
        }
    }

    static login = async ({ email, password }) => {
        const foundUser = await UserService.findUserByEmail(email)

        if (!foundUser) throw new BadRequestError('User not found')

        const matchingPassword = await bcrypt.compare(password, foundUser.password)

        if (!matchingPassword) throw new BadRequestError('BadCredential')

        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createPairToken(
            {
                userId: foundUser._id,
                email
            },
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            publicKey,
            privateKey
        })

        return {
            code: 200,
            data: {
                user: getInfoData(foundUser, ['_id', 'name', 'email']),
                tokens
            }
        }
    }
}

module.exports = AccessService