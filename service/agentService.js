'use strict';
const { Op } = require("sequelize");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const util = require("../utils/log")

/***************** Service by Agent **************/

/**
 * Logged in agent and employee into the system
 **/
exports.loginAgent = function (body) {
  return new Promise(function (resolve, reject) {
    const { username, password } = body

    if (username && password && body !== 'undefined') {

      (async () => {

        const agentTable = mysqlConnector.agent;
        const employeeTable = mysqlConnector.employee
        const sessionAgentTable = mysqlConnector.sessionAgent;
        const sessionEmployeeTable = mysqlConnector.sessionEmployee

        const resAgent = await agentTable.findOne({
          where: {
            username: username,
          },
          attributes: ['id', 'username', 'password', 'agentName','agentRefCode'],
          raw: true
        });

        const resEmp = await employeeTable.findOne({
          where: {
            username: username,
          },
          attributes: ['id', 'username', 'password', 'firstname', 'lastname','agentRefCode'],
          raw: true
        });

        if (!resAgent && !resEmp) {
          return reject(respConvert.businessError(msgConstant.core.login_failed))
        }

        let findSessionAgent;
        // if username and password of Agent is true
        if (resAgent && await bcrypt.compare(password, resAgent.password)) {
          findSessionAgent = await sessionAgentTable.findOne({
            where: {
              agentId: resAgent.id,
              status: 'Y'
            },
            raw: true
          });
        }

        let findSessionEmployee;
        // if username and password of Employee is true
        if (resEmp && await bcrypt.compare(password, resEmp.password)) {
          findSessionEmployee = await sessionEmployeeTable.findOne({
            where: {
              employeeId: resEmp.id,
              status: 'Y'
            },
            raw: true
          });
        }
        // else {
        //   return reject(respConvert.businessError(msgConstant.core.login_failed))
        // }

        //if this Agent is already logged in system.
        if (findSessionAgent) {
          // update status of old session and token to 'N' that mean
          // this token is not valid now.
          const updateSessionStatus = sessionAgentTable.update({ status: "N" }, {
            where: {
              id: findSessionAgent.id,
              agentId: findSessionAgent.agentId
            }
          })
        }

        //if this Employee is already logged in system.
        if (findSessionEmployee) {
          // update status of old session and token to 'N' that mean
          // this token is not valid now.
          const updateSessionStatus = sessionEmployeeTable.update({ status: "N" }, {
            where: {
              id: findSessionEmployee.id,
              employeeId: findSessionEmployee.employeeId
            }
          })
        }

        let token;
        if (resAgent) {
          token = jwt.sign(
            {
              id: resAgent.id,
              name: resAgent.agentName,
              username: resAgent.username,
              type: 'Agent',
              agentRefCode:agentRefCode
            },
            process.env.JWT_TOKEN_SECRET_KEY,
            { expiresIn: '30m' }
          );

          const addTokenToSession = await sessionAgentTable.create({
            agentId: resAgent.id,
            token: token,
            status: 'Y'
          });
        }
        if (resEmp) {
          token = jwt.sign(
            {
              id: resEmp.id,
              username: resEmp.username,
              firstname: resEmp.firstname,
              lastname: resEmp.lastname,
              type: 'Employee',
              agentRefCode:agentRefCode
            },
            process.env.JWT_TOKEN_SECRET_KEY,
            { expiresIn: '30m' }
          );

          const addTokenToSession = await sessionEmployeeTable.create({
            employeeId: resEmp.id,
            token: token,
            status: 'Y'
          });
        }

        resolve(respConvert.successWithToken(token));

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
 * Logged out agent from system and session.
 **/
exports.logoutAgent = function (req) {
  return new Promise(function (resolve, reject) {

    const token = req.headers['authorization'].split(" ")[1];

    if (token) {
      (async () => {

        const decoded = jwt.decode(token);

        if (decoded == null) return reject(respConvert.businessError(msgConstant.core.invalid_token));

        if (decoded.type == 'Agent') {
          const sessionAgentTable = mysqlConnector.sessionAgent
          const updateAgentSessionLogout = await sessionAgentTable.update({ status: 'N' }, {
            where: {
              agentId: decoded.id,
              token: token,
            }
          });
        } else {
          const sessionEmployeeTable = mysqlConnector.sessionEmployee
          const updateEmployeeSessionLogout = await sessionEmployeeTable.update({ status: 'N' }, {
            where: {
              employeeId: decoded.id,
              token: token,
            }
          });
        }

        resolve(respConvert.success());

      })().catch(function (err) {
        console.log('[error on catch] : ' + err)
        reject(respConvert.systemError(err.message))
      })
    } else {
      reject(respConvert.businessError(msgConstant.core.invalid_token));
    }

  });
}


/**
 * Finds agent detail include wallet amount, sum player wallet.
 **/
exports.findAgentDetail = function (req) {
  return new Promise(function (resolve, reject) {

    const userData = req.user;

    (async () => {

      const agentTable = mysqlConnector.agent
      const playerTable = mysqlConnector.player

      const agentInfo = await agentTable.findOne({
        where: {
          id: userData.id
        },
        attributes: ['agentName', 'walletId','agentRefCode'],
        raw: true
      });

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet')

      const agentWalletAmount = await agentWalletCollec.findOne({
        _id: ObjectId(agentInfo.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } })

      //find total player by agent
      const totalPlayerOfThisAgent = await playerTable.count({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        raw: true
      })


      //find total player credit by agent
      const listOfPlayerWalletId = await playerTable.findAll({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        attributes: ['walletId'],
        raw: true
      })

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')
      const totalPlayerWalletSum = await playerWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfPlayerWalletId.map((id) => ObjectId(id.walletId)) }

          }
        },
        {
          $group: { _id: 0, sum: { $sum: "$amount_coin" } },
        },
      ]).toArray()

      console.log(totalPlayerWalletSum)
      //find total promotion credit

      //!!!Warning. Some data of this resolve still mock data!!!!
      resolve(respConvert.successWithData({
        agentName: agentInfo.agentName,
        amountCoin: agentWalletAmount.amount_coin,
        totalPlayer: totalPlayerOfThisAgent,
        totalPlayerCredit: totalPlayerWalletSum.length == 0 ? 0 : totalPlayerWalletSum[0].sum,
        totalPromotionCredit: 0
      }, req.newTokenReturn)
      );



    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}



/****
 * Agent payment request.
 * Also add log. (unfunished)
 **/
exports.agentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, promotionId } = req.body

    if (paymentType && wayToPay && amount && (promotionId || promotionId === 0 || promotionId === 'default' || promotionId == null)) {

      (async () => {

        const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

        const paymentReqCreated = await agentPaymentReqTable.create({
          agentId: req.user.id,
          paymentType: paymentType,
          wayToPay: wayToPay,
          amount: amount,
          promotionRefId: promotionId === 0 || promotionId === 'default' ? null : promotionId,
          paymentStatus: 'W',
          createBy: req.user.id,
          createDateTime: new Date()
        })

        //(type, ref, desc, userId, createBy) 
        await util.agentLog('pay', paymentReqCreated.id, null, null, req.user.id)

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
 * update empoyee
 *
 * body PlayerModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.agentmpoyee = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}




/**
 * Finds wallet player by token key
 * Finds wallet player detail by token key.
 *
 * returns List
 **/
exports.findById = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = [{
      "amountCoin": 6.027456183070403,
      "coinList": [{
        "key": ""
      }, {
        "key": ""
      }],
      "userid": 0
    }, {
      "amountCoin": 6.027456183070403,
      "coinList": [{
        "key": ""
      }, {
        "key": ""
      }],
      "userid": 0
    }];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get payment detail from page agent-detail payment request list table.
 **/
exports.getPaymentDetailById = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { paymentId } = req.body

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

      const paymentDetail = await agentPaymentReqTable.findOne({
        where: {
          id: paymentId
        },
        attributes: ['id', 'createDateTime', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        raw: true
      })

      resolve(respConvert.successWithData(paymentDetail, req.newTokenReturn))
    })().catch(function (err) {
      reject(respConvert.systemError(err.message))
    })
  });
}


/**
 * payment player detail
 * Returns a single pet
 *
 * paymentId Long ID of pet to return
 * returns PaymentModel
 **/
exports.getplayerById = function (paymentId) {
  return new Promise(function (resolve, reject) {
    const payment = dbPlayer.Payment;
    (async () => {
      const paymentlist = await payment.findOne({
        where: {
          id: {
            [Op.eq]: paymentId
          }
        }
      });
      resolve(paymentlist);
    })();
  });
}


/**
 * List payment request by agent Id.
 *
 **/
exports.listAgentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {
      const agentPaymentReqTable = mysqlConnector.agentPaymentReq
      const promotionTable = mysqlConnector.promotion
      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestList = await agentPaymentReqTable.findAll({
        where: {
          createBy: req.user.id
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          }
        ],
        raw: true,
        nest: true
      })

      resolve(respConvert.successWithData(paymentRequestList, req.newTokenReturn));
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })
  });
}










/************************ Agent Operation By Owner*************************/

/**
 * Get Agent wallet amount by agent Id.
 **/
exports.findAgentWalletById = function (req) {
  return new Promise(function (resolve, reject) {

    const { agentId } = req.body

    const agentTable = mysqlConnector.agent;

    (async () => {
      const agentWalletId = await agentTable.findOne({
        where: {
          id: agentId
        },
        attributes: ['walletId'],
        raw: true
      })

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet')
      const agentWalletAmount = await agentWalletCollec.findOne({
        _id: ObjectId(agentWalletId.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } })

      resolve(respConvert.successWithData(agentWalletAmount))
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}


/**
 * Agent payment request By Owner
 **/
exports.agentPaymentRequestByOwner = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, agentId, promotionId } = req.body

    if (paymentType && wayToPay && amount) {

      (async () => {

        const agentPaymentReqTable = mysqlConnector.agentPaymentReq

        const requestCreate = await agentPaymentReqTable.create(
          {
            agentId: !agentId ? req.user.id : agentId,
            paymentType: paymentType,
            wayToPay: wayToPay,
            amount: amount,
            promotionRefId: !promotionId ? null : promotionId,
            paymentStatus: 'W',
            // createBy: req.user.id,
            createBy: null,
            createDateTime: new Date(),
            // createRoleType: req.user.type
            createRoleType: null
          }
        )

        resolve(respConvert.success());

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
 * List player payment request of each Player.
 **/
exports.paymentRequestListOfAgent = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { agentId } = req.body

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq
      const promotionTable = mysqlConnector.promotion

      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestListOfAgent = await agentPaymentReqTable.findAll({
        where: {
          agentId: agentId
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          }
        ],
        raw: true,
        nest: true
      })

      resolve(respConvert.successWithData(paymentRequestListOfAgent));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}

/************************ Agent Operation By Owner*************************/









/**
 * List agent payment request
 *
 * returns PaymentModel
 **/
exports.listplayerPaymentRequest = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "Status": "Status",
      "agentId": 6,
      "Amount": 1.4658129805029452,
      "id": 0
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs employee into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginemployee = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "token": "token"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs out current logged in user session
 *
 * no response value expected for this operation
 **/
exports.logoutemployee = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * agent payment request
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.playerAgentRequest = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * update empoyee
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.playerAgentRequestupdate = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}