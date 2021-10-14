const mysqlConnector = require("../connector/mysqlConnector")

exports.getRefCodeSequence = async function () {
    const sequenceCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceCodeTable.max('refCode')
    return sequenceNow
}

exports.updateRefCodeSequence = async function () {
    const sequenceCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceCodeTable.max('refCode')
    await sequenceCodeTable.increment('refCode', { by: 1, where: { refCode: sequenceNow } });
}

exports.getPromotionCodeSequence = async function () {
    const sequenceCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceCodeTable.max('promotion_code')
    return sequenceNow
}

exports.updatePromotionCodeSequence = async function () {
    const sequenceCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceCodeTable.max('promotion_code')
    await sequenceCodeTable.increment('promotion_code', { by: 1, where: { promotion_code: sequenceNow } });
}