const msgConstant = require("../constant/messageMapping");

exports.success = function () {
    return msgConstant.core.success
}

exports.successWithData = function (data) {

    const successMessage = msgConstant.core.success
    
    return {
        data: data,
        code: successMessage.code,
        message: successMessage.message
    }
}

exports.validateError = function () {
    return msgConstant.core.validate_error
}

exports.businessError = function (messageObj) {

    const respCode = messageObj.code
    const respMessage = messageObj.message

    return {
        code: respCode,
        message: respMessage
    }
}

exports.systemError = function (errorMessage) {
    return {
        code: "LTR-500",
        message: errorMessage
    }
}