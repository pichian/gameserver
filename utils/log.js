const mysqlConnector = require("../connector/mysqlConnector")

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
            console.log('[error on catch inside log] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    })
}