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

exports.validateError = function (newToken) {
    return {
        responseCode: msgConstant.core.validate_error.responseCode,
        responseMessage: msgConstant.core.validate_error.responseMessage,
        newToken: newToken
    }
}

exports.businessError = function (messageObj, newToken) {
    const respCode = messageObj.responseCode
    const respMessage = messageObj.responseMessage

    return {
        responseCode: respCode,
        responseMessage: respMessage,
        newToken: newToken
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