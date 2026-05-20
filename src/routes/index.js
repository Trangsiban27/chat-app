'use strict'

const express = require('express')
const { apiKey, checkPermission } = require('../auth/checkAuth')
const router = express.Router()

router.use(apiKey)

router.use(checkPermission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/user', require('./user'))
router.use('/v1/api/post', require('./post'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/chat/', require('./chat'))

module.exports = router