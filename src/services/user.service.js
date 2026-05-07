'use strict'

const { BadRequestError, NotfoundError } = require("../core/error.response")
const usersModel = require("../models/users.model")
const { convertObjectIdMongoDB, getInfoData } = require("../utils")

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

    static updateUserProfile = async (userId, updateData) => {
        if (!userId) throw new BadRequestError('User not found')

        const block = ['password', 'email', '_id', 'createdAt', 'updatedAt', '__v', 'avatar']
        block.forEach(field => delete updateData[field])

        const updateUser = await usersModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            {
                new: true
                , runValidators: true
            }
        ).select('-password -_id -createdAt -updatedAt -__v -avatar').lean()

        if (!updateUser) throw new NotFoundError('User not found!')

        return updateUser
    }

    static getUserProfile = async (userId) => {
        if (!userId) throw new BadRequestError('User not found')

        const user = await usersModel.findById(userId)

        if (!user) throw new NotfoundError('User not found')

        return getInfoData(user, ['email', 'username', 'avatar'])
    }

    static updatePrivacySetting = async (userId, settings) => {
        if (!userId) throw new NotfoundError('User not found')

        const updateSettings = {}
        for (let key in settings) {
            updateSettings[`settings.${key}`] = settings[key]
        }

        const updateUser = await usersModel.findByIdAndUpdate(
            userId,
            { $set: updateSettings },
            { new: true, runValidators: true }
        )

        if (!updateUser) throw new NotfoundError('User not found!')

        return getInfoData(updateUser, ['settings'])
    }

    static getUserPrivacy = async (userId) => {
        if (!userId) throw new NotfoundError('User not found')

        const userSettings = await usersModel.findById(userId).select('settings')

        return userSettings
    }
}

module.exports = UserService