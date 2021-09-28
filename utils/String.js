exports.getPaymentTypeText = function (paymentType) {
    const lwcPaymentType = paymentType.toLowerCase()
    if (lwcPaymentType == 'wd') {
        return 'Withdraw'
    } else if (lwcPaymentType == 'dp') {
        return 'Deposit'
    } else {
        return '';
    }
}

exports.pushCreateById = function (dataList,dataObj) {
    
    var result = []
    result.push(dataObj.id)

    dataList.forEach(element => {
        result.push(element.id)
    });

    return result;
}
