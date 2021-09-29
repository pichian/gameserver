const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");

exports.agentLog = function (type, ref, desc, userId, createBy) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const agentLogTable = mysqlConnector.agentLog

            const logCreate = await agentLogTable.create({
                userId: userId,
                logType: type,
                logRef: ref,
                description: desc,
                createBy: createBy
            })

            resolve()

        })().catch(function (err) {
            console.log('[error on catch inside agentLog] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    })
}

exports.employeeLog = function (playerId, logType, logReference, description, createBy) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const employeeLogTable = mysqlConnector.employeeLog

            const logCreate = await employeeLogTable.create({
                playerId: playerId,
                logType: logType,
                logReference: logReference,
                description: description,
                createBy: createBy
            })

            resolve()

        })().catch(function (err) {
            console.log('[error on catch inside employeeLog] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    })
}