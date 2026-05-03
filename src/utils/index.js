const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const _ = require('lodash')

const convertObjectIdMongoDB = (id) => {
    if (!id) throw new BadRequestError('Id not found!')

    if (!Types.ObjectId.isValid(id)) throw new BadRequestError('Invalid id!')

    return new Types.ObjectId(id)
}

const getInfoData = (object = {}, fields = []) => {
    return _.pick(object, fields)
}

module.exports = {
    convertObjectIdMongoDB,
    getInfoData
}