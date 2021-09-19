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

        console.log(req.body)
        // if (
        //     body.promotionName !== undefined &&
        //     body.promotionType !== undefined &&
        //     body.rateType !== undefined &&
        //     body.rateAmount !== undefined &&
        //     body.dateStart !== undefined &&
        //     body.dateStop !== undefined &&
        //     body.description !== undefined &&
        //     body.status !== undefined
        // ) {
        //     (async () => {
        //         const promotionTable = dbPromotionConnector.Promotion

        //         await promotionTable.create({
        //             promotionName: body.promotionName,
        //             promotionType: body.promotionType,
        //             rateType: body.rateType,
        //             rateAmount: body.rateAmount,
        //             dateStart: body.dateStart,
        //             dateStop: body.dateStop,
        //             status: body.status,
        //             description: body.description,
        //             createBy: 1,
        //             createDateTime: new Date(),
        //             updateBy: 1,
        //             updateDateTime: new Date(),
        //         });

        //         resolve(respConvert.success());

        //     })().catch(function (err) {
        //         reject(respConvert.systemError(err.message))
        //     })
        // } else {
        //     reject(respConvert.validateError(msgConstant.core.validate_error));
        // }

        resolve(respConvert.success());
    });
}
