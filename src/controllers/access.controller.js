'use strict'

const { SuccessResponse } = require('../core/success.response')
const accessService = require('../services/access.service')

class AccessController {

    signUp = async (req, res, next) => {
        new SuccessResponse({
            message: 'Sign up successful',
            metadata: await accessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login success",
            metadata: await accessService.login(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()