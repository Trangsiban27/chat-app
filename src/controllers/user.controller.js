'use strict'

const { SuccessResponse } = require("../core/success.response")
const UserService = require("../services/user.service")

class UserController {
    uploadAvatar = async (req, res, next) => {
        const userId = req.user
        const file = req.file

        // console.log('--- DEBUG ---');
        // console.log('User ID:', userId);
        // console.log('File:', file ? file : 'No file');

        new SuccessResponse({
            message: 'Upload avatar successfully!',
            metadata: await UserService.uploadUserAvatar(file, userId)
        }).send(res)
    }

    updateUserProfile = async (req, res, next) => {
        const userId = req.user
        const updateData = req.body

        new SuccessResponse({
            message: 'Update user profile successfully!',
            metadata: await UserService.updateUserProfile(userId, updateData)
        }).send(res)
    }
}

module.exports = new UserController();