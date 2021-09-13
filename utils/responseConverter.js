const msgConstant = require("../constant/messageMapping");

exports.success = function () {
    return msgConstant.core.success
}

exports.successWithData = function (data) {

    const successMessage = msgConstant.core.success
    
    return {
        data: data,
        responseCode: successMessage.code,
        responseMessage: successMessage.message
    }
}

exports.validateError = function () {
    return msgConstant.core.validate_error
}

exports.businessError = function (messageObj) {

    const respCode = messageObj.code
    const respMessage = messageObj.message

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