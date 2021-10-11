const mysqlConnector = require("../connector/mysqlConnector")

exports.getRefCodeSequence = async function () {
    const sequenceRefCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceRefCodeTable.max('refCode')
    return sequenceNow
}

exports.updateRefCodeSequence = async function () {
    const sequenceRefCodeTable = mysqlConnector.sequence
    const sequenceNow = await sequenceRefCodeTable.max('refCode')
    await sequenceRefCodeTable.increment('refCode', { by: 1, where: { refCode: sequenceNow } });
}