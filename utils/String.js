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