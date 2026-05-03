'use strict'

const { BadRequestError } = require("../core/error.response")
const usersModel = require("../models/users.model")
const { convertObjectIdMongoDB } = require("../utils")

class UserService {

    static findUserById = async (id) => {
        if (!id) throw new BadRequestError('Id not found!')

        return await usersModel.findById(convertObjectIdMongoDB(id))
    }

    static findUserByEmail = async (email) => {
        if (!email) throw new BadRequestError('Email not found!')

        return await usersModel.findOne({
            email
        })
    }
}

module.exports = UserService