const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const utilLog = require('../utils/log')


/**
 * Create Promotion by Agent.
 **/
exports.promotionCreate = function (req) {
    return new Promise(function (resolve, reject) {

        const { promotionName, promotionType, rateType, rateAmount, dateStart, dateStop, status, description } = req.body

        if (promotionName && promotionType && rateType && rateAmount && dateStart && dateStop && status && description || description == '') {

            (async () => {
                const promotionTable = mysqlConnector.promotion

                await promotionTable.create({
                    promotionName: promotionName,
                    promotionType: promotionType,
                    rateType: rateType,
                    rateAmount: rateAmount,
                    dateStart: dateStart,
                    dateStop: dateStop,
                    status: status,
                    description: description,
                    createBy: req.user.id,
                    createDateTime: new Date(),
                    updateBy: req.user.id,
                    updateDateTime: new Date(),
                });

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('create', null, 'promotion', promotionTable.id, req.user.id)

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
 * List Promotion
 **/
exports.listPromotionByAgentId = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const promotionTable = mysqlConnector.promotion

            const promotionList = await promotionTable.findAll({
                where: {
                    create_by: req.user.id
                },
                attributes: ['id', 'dateStart', 'dateStop', 'promotionName', 'promotionType', 'rateType', 'rateAmount'],
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

            const { promotionId } = req.body
            const promotionTable = mysqlConnector.promotion;

            const promotionInfo = await promotionTable.findOne({
                where: {
                    id: promotionId
                },
                attributes: ['id', 'dateStart', 'dateStop', 'promotionName',
                    'promotionType', 'rateType', 'rateAmount', 'status', 'description'],
                raw: true
            })

            resolve(respConvert.successWithData(promotionInfo, req.newTokenReturn))

        })().catch(function (err) {
            reject(respConvert.systemError(err.message))
        })
    });
}

