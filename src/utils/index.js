const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const _ = require('lodash')

const convertObjectIdMongoDB = (id) => {
    if (!id) throw new BadRequestError('Id not found!')

    const idStr = id.toString();

    if (!Types.ObjectId.isValid(idStr)) {
        throw new BadRequestError('Invalid id format!');
    }

    return new Types.ObjectId(idStr);
}

const getInfoData = (object = {}, fields = []) => {
    return _.pick(object, fields)
}

module.exports = {
    convertObjectIdMongoDB,
    getInfoData
}