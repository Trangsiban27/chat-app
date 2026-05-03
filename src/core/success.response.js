'use strict'

const StatusCode = {
    CREATED: 201,
    OK: 200
}

const ReasonStatusCode = {
    CREATED: 'Created successfully',
    OK: 'Request successful'
}

class SuccessResponse {

    constructor({ message, status = StatusCode.OK, reasonStatus = ReasonStatusCode.OK, metadata = {} }) {

        this.message = !message ? reasonStatus : message
        this.status = status,
            this.metadata = metadata
    }

    send(res, headers = {}) {

        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {

    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class Created extends SuccessResponse {

    constructor({ message, status = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, status, reasonStatusCode, metadata })
    }
}

module.exports = {
    SuccessResponse,
    OK,
    Created
}