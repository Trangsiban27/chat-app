'use strict'

const apiKeysModel = require("../models/apiKeys.model")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {

        const key = req.headers[HEADER.API_KEY]?.toString()

        if (!key) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const foundKey = await apiKeysModel.findOne({ key })

        if (!foundKey) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        req.objKey = foundKey

        return next()
    } catch (err) {
        console.log('err: ', err)
        next(err)
    }
}

const checkPermission = (permission) => {

    return (req, res, next) => {

        if (!req.objKey.permissions) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const validPermission = req.objKey.permissions.includes(permission)

        if (!validPermission) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        next()
    }
}

module.exports = {
    apiKey,
    checkPermission
}