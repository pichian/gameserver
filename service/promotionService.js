const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const utilLog = require('../utils/log')
const commUtil = require('../utils/common')
const strUtil = require("../utils/String")

/**
 * Create Promotion by Agent.
 **/
exports.promotionCreate = function (req) {
    return new Promise(function (resolve, reject) {

        const { promotionName, promotionType, rateType, rateAmount, dateStart, dateStop, status, description } = req.body

        if (promotionName && promotionType && rateType && rateAmount && dateStart && dateStop && status && description || description == '') {

            (async () => {
                const promotionTable = mysqlConnector.promotion
                const sequenceNow = await commUtil.getPromotionCodeSequence()

                await promotionTable.create({
                    promotionCode: 'prm' + strUtil.paddingNumber(sequenceNow, 3),
                    promotionName: promotionName,
                    promotionType: promotionType,
                    rateType: rateType,
                    rateAmount: rateAmount,
                    dateStart: new Date(dateStart),
                    dateStop: new Date(dateStop),
                    status: status,
                    description: description,
                    createRoleType: req.user.type,
                    createBy: req.user.userRefCode,
                    createDateTime: new Date(),
                    updateBy: req.user.userRefCode,
                    updateDateTime: new Date(),
                });

                //update sequence
                await commUtil.updatePromotionCodeSequence()

                if (req.user.type.toLowerCase() == 'agent') {
                    //(type, ref, desc, userId, createBy) 
                    await utilLog.agentLog('create', null, 'promotion', promotionTable.id, req.user.id)
                }

                resolve(respConvert.success(req.newTokenReturn));

            })().catch(function (err) {
                console.log('[error on catch] : ' + err)
                reject(respConvert.systemError(err.message))
            })
        } else {
            reject(respConvert.validateError(msgConstant.core.validate_error));
        }

    });
}

/**
 * Update Promotion by Agent.
 **/
exports.promotionUpdate = function (req) {
    return new Promise(function (resolve, reject) {

        const { promotionCode, promotionName, promotionType, rateType, rateAmount, dateStart, dateStop, status, description } = req.body

        if (promotionCode, promotionName && promotionType && rateType && rateAmount && dateStart && dateStop && status && description || description == '') {

            (async () => {


                const promotionTable = mysqlConnector.promotion

                await promotionTable.update({
                    promotionName: promotionName,
                    promotionType: promotionType,
                    rateType: rateType,
                    rateAmount: rateAmount,
                    dateStart: dateStart,
                    dateStop: dateStop,
                    status: status,
                    description: description,
                    updateBy: req.user.userRefCode,
                    updateDateTime: new Date(),
                }, {
                    where: { promotionCode: promotionCode }
                });

                if (req.user.type.toLowerCase() == 'agent') {
                    //(type, ref, desc, userId, createBy) 
                    await utilLog.agentLog('create', null, 'promotion', promotionTable.id, req.user.id)
                }

                resolve(respConvert.success(req.newTokenReturn));

            })().catch(function (err) {
                console.log('[error on catch] : ' + err)
                reject(respConvert.systemError(err.message))
            })
        } else {
            reject(respConvert.validateError(msgConstant.core.validate_error));
        }

    });
}

/**
 * List Promotion by agent
 **/
exports.listPromotionByAgentId = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const promotionTable = mysqlConnector.promotion

            const promotionList = await promotionTable.findAll({
                // where: {
                //     create_by: req.user.id
                // },
                attributes: ['promotionCode', 'dateStart', 'dateStop', 'promotionName', 'promotionType', 'rateType', 'rateAmount'],
                raw: true
            });

            resolve(respConvert.successWithData(promotionList, req.newTokenReturn));

        })().catch(function (err) {
            console.log('[error on catch] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    });
}

/**
 * Get single promotion detail.
 **/
exports.getPromotionDetailById = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const { promotionCode } = req.body
            const promotionTable = mysqlConnector.promotion;

            const promotionInfo = await promotionTable.findOne({
                where: {
                    promotionCode: promotionCode
                },
                attributes: ['promotionCode', 'dateStart', 'dateStop', 'promotionName',
                    'promotionType', 'rateType', 'rateAmount', 'status', 'description'],
                raw: true
            })

            resolve(respConvert.successWithData(promotionInfo, req.newTokenReturn))

        })().catch(function (err) {
            reject(respConvert.systemError(err.message))
        })
    });
}


/**
 * Stop promotion .
 **/
exports.promotionStop = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const { promotionCode } = req.body
            const promotionTable = mysqlConnector.promotion;

            const promotionUpdateStatus = await promotionTable.update(
                { status: 'inactive' },
                {
                    where: {
                        promotionCode: promotionCode
                    }
                })

            resolve(respConvert.success(req.newTokenReturn));

        })().catch(function (err) {
            console.log('[error on catch] : ' + err)
            reject(respConvert.systemError(err.message))
        })


    });
}

/**
 * List Promotion all by owner
 **/
exports.listPromotionAll = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const promotionTable = mysqlConnector.promotion

            const promotionList = await promotionTable.findAll({
                attributes: ['promotionCode', 'dateStart', 'dateStop', 'promotionName', 'promotionType', 'rateType', 'rateAmount'],
                raw: true
            });

            resolve(respConvert.successWithData(promotionList, req.newTokenReturn));

        })().catch(function (err) {
            console.log('[error on catch] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    });
}
