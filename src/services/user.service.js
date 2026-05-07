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

    static uploadUserAvatar = async (file, userId) => {
        if (!file) throw new BadRequestError('File not found!')
        if (!userId) throw new BadRequestError('User Id not found!')

        console.log('file: ', file)
        console.log('userId: ', userId)

        const avatarUrl = file.path

        const updateUser = await usersModel.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        )

        if (!updateUser) throw new NotFoundError('User not found!')

        return {
            userId: updateUser._id,
            avatar: updateUser.avatar
        }
    }
}

module.exports = UserService