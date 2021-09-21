const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { ObjectID } = require('bson');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dbConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");


/**
 * Create Promotion by Agent.
 **/
exports.promotionCreate = function (req) {
    return new Promise(function (resolve, reject) {

        const { promotionName, promotionType, rateType, rateAmount, dateStart, dateStop, status, description } = req.body

        if (promotionName && promotionType && rateType && rateAmount && dateStart && dateStop && status && description || description == '') {

            (async () => {
                const promotionTable = dbConnector.promotion

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

                resolve(respConvert.success());

            })().catch(function (err) {
                reject(respConvert.systemError(err.message))
            })
        } else {
            reject(respConvert.validateError(msgConstant.core.validate_error));
        }

    });
}

/**
 * List Player
 *
 * returns PlayerModel
 **/
exports.listPromotionByAgentId = function (req) {
    return new Promise(function (resolve, reject) {

        const promotionTable = dbConnector.promotion

            (async () => {
                const promotionList = await promotionTable.findAll({
                    where: {
                        create_by: {
                            [Op.eq]: req.user.id
                        }
                    },
                    attributes: ['id', 'dateStart', 'dateStop', 'promotionName', 'promotionType', 'rateType', 'rateAmount'],
                    raw: true
                })
                resolve(respConvert.successWithData(promotionList))
            })().catch(function (err) {
                reject(respConvert.systemError(err.message))
            })

    });
}