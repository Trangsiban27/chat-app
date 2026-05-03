'use strict'

const express = require('express')
const asyncHandler = require('../../helper/asyncHandler')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

router.post('/register', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))

module.exports = router