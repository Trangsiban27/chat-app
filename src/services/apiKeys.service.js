'use strict'

const apiKeysModel = require("../models/apiKeys.model")
const crypto = require('crypto')

class ApiKeysService {

    static findKey = async (key) => {

        // const newKey = await apiKeysModel.create({
        //     key: crypto.randomBytes(64).toString('hex'),
        //     permissions: ['0000']
        // })

        const objKey = await apiKeysModel.findOne({
            key,
            status: true
        })

        return objKey
    }
}

module.exports = ApiKeysService