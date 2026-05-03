'use strict'

const ErrorMessage = {
    BadRequestError: 'Bad request error!',
    NotfoundError: 'Not found!',
    ForbiddenError: 'Forbidden',
}

const ErrorStatus = {
    BadRequestError: 400,
    NotfoundError: 404,
    ForbiddenError: 403,
}

class ErrorResponse extends Error {

    constructor(message, status) {

        super(message)
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {

    constructor(message = ErrorMessage.BadRequestError, status = ErrorStatus.BadRequestError) {
        super(message, status)
    }
}

class NotfoundError extends ErrorResponse {

    constructor(message = ErrorMessage.NotfoundError, status = ErrorStatus.NotfoundError) {
        super(message, status)
    }
}

class ForbiddenError extends ErrorResponse {

    constructor(message = ErrorMessage.ForbiddenError, status = ErrorStatus.ForbiddenError) {
        super(message, status)
    }
}

module.exports = {
    BadRequestError,
    NotfoundError,
    ForbiddenError
}