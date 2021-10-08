'use strict';
const jwt = require("jsonwebtoken");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")

exports.authToken = function (req) {
    return new Promise(function (resolve, reject) {

        const token = req.headers['authorization'].split(" ")[1];

        (async () => {

            //check if is not valid token.
            if (token == 'null') {
                return reject(respConvert.businessError(msgConstant.core.invalid_token))
            }

            //if it not expired.
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)

            //check if it not valid on session
            const isNotValidToken = await checkTokenValidHandler(decoded, token)
            if (isNotValidToken) return reject(respConvert.businessError(msgConstant.core.session_timeout))

            //always generate new token if not expired and still valid.
            const generatedNewToken = jwt.sign(
                {
                    id: decoded.id,
                    name: decoded.name,
                    username: decoded.username,
                    type: decoded.type,
                    userRefCode: decoded.userRefCode
                },
                process.env.JWT_TOKEN_SECRET_KEY,
                { expiresIn: '30m' }
            );

            //decoded and return to req.user
            const newtokenDecoded = jwt.decode(generatedNewToken)

            //update new token to each user session .
            updateUserSessionHandler(decoded, generatedNewToken, token)

            req.user = newtokenDecoded
            req.newTokenReturn = generatedNewToken

            resolve()

        })().catch(function (err) {
            console.log('[error on catch in auth] : ' + err.message)

            //if expired or other error
            if (err.message == 'jwt expired') {
                const decodedExpiredToken = jwt.decode(token);
                removeUserSessionHandler(decodedExpiredToken, token)
                return reject(respConvert.businessError(msgConstant.core.token_expire))
            }

            console.log('malform case ' + token)
            reject(respConvert.systemError(err.message))
        })
    });

}

function updateUserSessionHandler(decodedToken, newToken, oldToken) {
    console.log('update ' + JSON.stringify(decodedToken))
    if (decodedToken.type == 'Player') {
        const sessionPlayerTable = mysqlConnector.sessionPlayer
        const updatePlayerSession = sessionPlayerTable.update({ token: newToken }, {
            where: {
                playerId: decodedToken.id,
                status: 'Y'
            },
        });
    } else if (decodedToken.type == 'Agent') {
        const sessionAgentTable = mysqlConnector.sessionAgent
        const removeAgentSession = sessionAgentTable.update({ token: newToken }, {
            where: {
                agentCode: decodedToken.userRefCode,
                status: 'Y'
            },
        });
    } else if (decodedToken.type == 'Employee') {
        const sessionEmployeeTable = mysqlConnector.sessionEmployee
        const removeEmployeeSession = sessionEmployeeTable.update({ token: newToken }, {
            where: {
                employeeId: decodedToken.id,
                status: 'Y'
            },
        });
    } else {
        const sessionOwnerTable = mysqlConnector.sessionOwner
        const removeOwnerSession = sessionOwnerTable.update({ token: newToken }, {
            where: {
                ownerCode: decodedToken.userRefCode,
                status: 'Y'
            },
        });
    }
    return
}

function removeUserSessionHandler(decodedExpiredToken, expiredToken) {
    console.log(decodedExpiredToken)
    if (decodedExpiredToken.type == 'Player') {
        const sessionPlayerTable = mysqlConnector.sessionPlayer
        const removePlayerSession = sessionPlayerTable.update({ status: 'N' }, {
            where: {
                playerId: decodedExpiredToken.id,
                token: expiredToken
            },
        });
    } else if (decodedExpiredToken.type == 'Agent') {
        const sessionAgentTable = mysqlConnector.sessionAgent
        const removeAgentSession = sessionAgentTable.update({ status: 'N' }, {
            where: {
                agentCode: decodedExpiredToken.userRefCode,
                token: expiredToken
            }
        });
    }
    else if (decodedExpiredToken.type == 'Employee') {
        const sessionEmployeeTable = mysqlConnector.sessionEmployee
        const removeEmployeeSession = sessionEmployeeTable.update({ status: 'N' }, {
            where: {
                employeeId: decodedExpiredToken.id,
                token: expiredToken
            }
        });
    } else {
        const sessionOwnerTable = mysqlConnector.sessionOwner
        const removeOwnerSession = sessionOwnerTable.update({ status: 'N' }, {
            where: {
                ownerCode: decodedExpiredToken.userRefCode,
                token: expiredToken
            }
        });
    }
    return
}

async function checkTokenValidHandler(decodedTokenData, token) {
    console.log('valid ' + JSON.stringify(decodedTokenData))
    if (decodedTokenData.type == 'Player') {
        const sessionPlayerTable = mysqlConnector.sessionPlayer
        const tokenValid = await sessionPlayerTable.findOne({
            where: {
                playerId: decodedTokenData.id,
                token: token,
                status: 'N'
            },
            raw: true
        });
        return tokenValid !== null ? true : false
    } else if (decodedTokenData.type == 'Agent') {
        const sessionAgentTable = mysqlConnector.sessionAgent
        const tokenValid = await sessionAgentTable.findOne({
            where: {
                agentCode: decodedTokenData.userRefCode,
                token: token,
                status: 'N'
            },
            raw: true
        });
        return tokenValid !== null ? true : false
    } else if (decodedTokenData.type == 'Employee') {
        const sessionEmployeeTable = mysqlConnector.sessionEmployee
        const tokenValid = await sessionEmployeeTable.findOne({
            where: {
                employeeId: decodedTokenData.id,
                token: token,
                status: 'N'
            },
            raw: true
        });
        return tokenValid !== null ? true : false
    } else {
        const sessionOwnerTable = mysqlConnector.sessionOwner
        const tokenValid = await sessionOwnerTable.findOne({
            where: {
                ownerCode: decodedTokenData.userRefCode,
                token: token,
                status: 'N'
            },
            raw: true
        });
        return tokenValid !== null ? true : false
    }
}

