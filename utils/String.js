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

exports.paddingNumberWithDate = function (number, maxLength) {
    var d = new Date();
    month = "" + (d.getMonth() + 1).toString().padStart(2, '0')
    day = "" + d.getDate().toString().padStart(2, '0')
    year = d.getFullYear();

    return day + month + year + number.toString().padStart(maxLength, 0);
}