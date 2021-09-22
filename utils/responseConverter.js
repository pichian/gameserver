const msgConstant = require("../constant/messageMapping");

exports.success = function (newToken) {
    return {
        responseCode: msgConstant.core.success.responseCode,
        responseMessage: msgConstant.core.success.responseMessage,
        newToken: newToken
    }
}

exports.successWithData = function (data, newToken) {
    return {
        data: data,
        responseCode: msgConstant.core.success.responseCode,
        responseMessage: msgConstant.core.success.responseMessage,
        newToken: newToken
    }
}

exports.validateError = function () {
    return msgConstant.core.validate_error
}

exports.businessError = function (messageObj) {
    const respCode = messageObj.responseCode
    const respMessage = messageObj.responseMessage

    return {
        responseCode: respCode,
        responseMessage: respMessage
    }
}

exports.systemError = function (errorMessage) {
    return {
        responseCode: "LTR-500",
        responseMessage: errorMessage
    }
}

exports.successWithToken = function (token) {
    return {
        token: token,
        responseCode: msgConstant.core.success.responseCode,
        responseMessage: msgConstant.core.success.responseMessage
    }
}