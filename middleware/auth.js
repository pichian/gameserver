'use strict';
const jwt = require("jsonwebtoken");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb")

const config = process.env

exports.authToken = function (req) {
    return new Promise(function (resolve, reject) {

        const token = req.headers['authorization'].split(" ")[1];

        (async () => {

            if (token == 'null') {
                return reject(respConvert.businessError(msgConstant.core.invalid_token))
            }

            const decoded = jwt.verify(token, 'TOKEN_SECRET_ad1703edd828154322f1543a43ccd4b3')
            req.user = decoded
            resolve()

        })().catch(function (err) {
            console.log('[error on catch] : ' + err.message)

            if (err.message == 'jwt expired') {
                const decodedExpiredToken = jwt.decode(token);
                removeUserSessionHandler(decodedExpiredToken, token)
                return reject(respConvert.businessError(msgConstant.core.token_expire))
            }

            reject(respConvert.systemError(err.message))
        })
    });

}

function removeUserSessionHandler(decodedExpiredToken, token) {
    if (decodedExpiredToken.type == 'Player') {
        const sessionPlayerTable = mysqlConnector.sessionPlayer
        const removePlayerSession = sessionPlayerTable.destroy({
            where: {
                token: token,
            }
        });
    } else if (decodedExpiredToken.type == 'Agent') {
        const sessionAgentTable = mysqlConnector.sessionAgent
        const removeAgentSession = sessionAgentTable.destroy({
            where: {
                token: token,
            }
        });
    }
    return
}