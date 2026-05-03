const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const ApiKeysService = require('./services/apiKeys.service')
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// ApiKeysService.findKey()

app.use('/', require('./routes'))

app.use((req, res, next) => {
    const error = new Error()

    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal server error!'
    })
})

module.exports = app