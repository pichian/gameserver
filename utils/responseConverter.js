const msgConstant = require("../constant/messageMapping");

exports.success = function () {
    return msgConstant.core.success
}

exports.successWithData = function (data) {
    return {
        data: data,
        responseCode: msgConstant.core.success.responseCode,
        responseMessage: msgConstant.core.success.responseCode
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

exports.successLogin = function (token) {
    return {
        token: token,
        responseCode: msgConstant.core.success.responseCode,
        responseMessage: msgConstant.core.success.responseCode
    }
}