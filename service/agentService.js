'use strict';
const { Op } = require("sequelize");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector");
const mongoConnector = require("../connector/mongodb");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const envConstant = require("../constant/env");
const util = require("../utils/log");

/***************** Service by Agent **************/

/**
 * Logged in agent and employee into the system
 **/
exports.loginAgent = function (body) {
  return new Promise(function (resolve, reject) {
    const { username, password } = body;

    if (username && password && body !== 'undefined') {

      (async () => {

        const agentTable = mysqlConnector.agent;
        const employeeTable = mysqlConnector.employee;
        const sessionAgentTable = mysqlConnector.sessionAgent;
        const sessionEmployeeTable = mysqlConnector.sessionEmployee;

        const resAgent = await agentTable.findOne({
          where: {
            username: username,
          },
          attributes: ['username', 'password', 'agentName', 'agentRefCode'],
          raw: true
        });

        const resEmp = await employeeTable.findOne({
          where: {
            username: username,
            status: 'active'
          },
          attributes: ['username', 'password', 'firstname', 'lastname', 'employeeRefCode'],
          raw: true
        });

        if (resAgent === null && resEmp === null) {
          return reject(respConvert.businessError(msgConstant.core.login_failed));
        }

        // if username and password of Agent is true
        if (resAgent !== null) {
          if (await bcrypt.compare(password, resAgent.password)) {
            const findSessionAgent = await sessionAgentTable.findOne({
              where: {
                agentCode: resAgent.agentRefCode,
                status: 'Y'
              },
              raw: true
            });

            //if this Agent is already logged in system.
            if (findSessionAgent) {
              // update status of old session and token to 'N' that mean
              // this token is not valid now.
              const updateSessionStatus = sessionAgentTable.update({ status: "N" }, {
                where: {
                  agentCode: findSessionAgent.agentCode
                }
              });
            }

            let token;
            if (resAgent) {
              token = jwt.sign(
                {
                  name: resAgent.agentName,
                  username: resAgent.username,
                  type: 'Agent',
                  userRefCode: resAgent.agentRefCode
                },
                envConstant.env.JWT_TOKEN_SECRET_KEY,
                { expiresIn: '30m' }
              );

              const addTokenToSession = await sessionAgentTable.create({
                agentCode: resAgent.agentRefCode,
                token: token,
                status: 'Y',
                createDateTime: new Date()
              });
            }

            resolve(respConvert.successWithToken(token));
          } else {
            return reject(respConvert.businessError(msgConstant.core.login_failed));
          }

        }

        console.log('resEmp', resEmp);
        // if username and password of Employee is true
        if (resEmp !== null) {
          if (await bcrypt.compare(password, resEmp.password)) {
            const findSessionEmployee = await sessionEmployeeTable.findOne({
              where: {
                employeeCode: resEmp.employeeRefCode,
                status: 'Y'
              },
              raw: true
            });

            //if this Employee is already logged in system.
            if (findSessionEmployee) {
              // update status of old session and token to 'N' that mean
              // this token is not valid now.
              const updateSessionStatus = sessionEmployeeTable.update({ status: "N" }, {
                where: {
                  employeeCode: findSessionEmployee.employeeCode
                }
              });
            }

            let token;

            if (resEmp) {
              token = jwt.sign(
                {
                  employeeCode: resEmp.employeeRefCode,
                  username: resEmp.username,
                  firstname: resEmp.firstname,
                  lastname: resEmp.lastname,
                  type: 'Employee',
                  userRefCode: resEmp.employeeRefCode
                },
                envConstant.env.JWT_TOKEN_SECRET_KEY,
                { expiresIn: '30m' }
              );

              const addTokenToSession = await sessionEmployeeTable.create({
                employeeCode: resEmp.employeeRefCode,
                token: token,
                status: 'Y',
                createDateTime: new Date()
              });
            }

            resolve(respConvert.successWithToken(token));
          } else {
            return reject(respConvert.businessError(msgConstant.core.login_failed));
          }
        }

      })().catch(function (err) {
        console.log('[error on catchhhh] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
};

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
          const sessionAgentTable = mysqlConnector.sessionAgent;
          const updateAgentSessionLogout = await sessionAgentTable.update({ status: 'N' }, {
            where: {
              agentCode: decoded.userRefCode,
              token: token,
            }
          });
        } else {
          const sessionEmployeeTable = mysqlConnector.sessionEmployee;
          const updateEmployeeSessionLogout = await sessionEmployeeTable.update({ status: 'N' }, {
            where: {
              employeeCode: decoded.userRefCode,
              token: token,
            }
          });
        }

        resolve(respConvert.success());

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });
    } else {
      reject(respConvert.businessError(msgConstant.core.invalid_token));
    }

  });
};


/**
 * Finds agent detail include wallet amount, sum player wallet.
 **/
exports.findAgentDetail = function (req) {
  return new Promise(function (resolve, reject) {

    const userData = req.user;

    (async () => {

      const agentTable = mysqlConnector.agent;
      const playerTable = mysqlConnector.player;

      const agentInfo = await agentTable.findOne({
        where: {
          agentRefCode: userData.userRefCode
        },
        attributes: ['agentName', 'walletId', 'agentRefCode'],
        raw: true
      });

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet');

      const agentWalletAmount = await agentWalletCollec.findOne({
        _id: ObjectId(agentInfo.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } });

      //find total player by agent
      const totalPlayerOfThisAgent = await playerTable.count({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        raw: true
      });


      //find total player credit by agent
      const listOfPlayerWalletId = await playerTable.findAll({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        attributes: ['walletId'],
        raw: true
      });

      const playerWalletCollec = mongoConnector.api.collection('player_wallet');
      const totalPlayerWalletSum = await playerWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfPlayerWalletId.map((id) => ObjectId(id.walletId)) }
          }
        },
        {
          $group: { _id: 0, sum: { $sum: "$amount_coin" } },
        },
      ]).toArray();

      //find total promotion credit

      //!!!Warning. Some data of this resolve still mock data!!!!
      resolve(respConvert.successWithData({
        agentName: agentInfo.agentName,
        agentRefCode: agentInfo.agentRefCode,
        amountCoin: agentWalletAmount.amount_coin,
        totalPlayer: totalPlayerOfThisAgent,
        totalPlayerCredit: totalPlayerWalletSum.length == 0 ? 0 : totalPlayerWalletSum[0].sum,
        totalPromotionCredit: 0
      }, req.newTokenReturn)
      );



    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(respConvert.systemError(err.message));
    });

  });
};



/****
 * Agent payment request.
 **/
exports.agentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, promotionId } = req.body;

    if (paymentType && wayToPay && amount && (promotionId || promotionId === 0 || promotionId === 'default' || promotionId == null)) {

      (async () => {

        const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

        const paymentReqCreated = await agentPaymentReqTable.create({
          agentRefCode: req.user.userRefCode,
          paymentType: paymentType,
          wayToPay: wayToPay,
          amount: amount,
          promotionRefId: promotionId === 0 || promotionId === 'default' ? null : promotionId,
          paymentStatus: 'W',
          createRoleType: req.user.type,
          createBy: req.user.userRefCode,
          createDateTime: new Date(),
          updateBy: req.user.userRefCode,
          updateDateTime: new Date()
        });

        //(type, ref, desc, userId, createBy) 
        await util.agentLog('pay', paymentReqCreated.id, null, null, req.user.userRefCode);

        resolve(respConvert.success(req.newTokenReturn));

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });

};


/**
 * Get payment detail from page agent-detail payment request list table.
 **/
exports.getPaymentDetailById = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { paymentId } = req.body;

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

      const paymentDetail = await agentPaymentReqTable.findOne({
        where: {
          id: paymentId
        },
        attributes: ['id', 'createDateTime', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        raw: true
      });

      resolve(respConvert.successWithData(paymentDetail, req.newTokenReturn));
    })().catch(function (err) {
      reject(respConvert.systemError(err.message));
    });
  });
};

/**
 * List payment request by agent Id.
 **/
exports.listAgentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {
      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;
      const promotionTable = mysqlConnector.promotion;
      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestList = await agentPaymentReqTable.findAll({
        where: {
          agentRefCode: req.user.userRefCode
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          }
        ],
        order: [['createDateTime', 'DESC']],
        raw: true,
        nest: true
      });

      resolve(respConvert.successWithData(paymentRequestList, req.newTokenReturn));
    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(respConvert.systemError(err.message));
    });
  });
};










/************************ Agent Operation By Owner*************************/

/**
 * Get Agent info include agent name, status, amount coin.
 **/
exports.getAgentInfo = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { agentRefCode } = req.body;
      const agentTable = mysqlConnector.agent;
      const playerTable = mysqlConnector.player;

      const agentInfo = await agentTable.findOne({
        where: {
          agentRefCode: agentRefCode
        },
        attributes: ['agentName', 'status', 'walletId', 'agentRefCode'],
        raw: true
      });

      //find total player by agent
      const totalPlayerOfThisAgent = await playerTable.count({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        raw: true
      });


      //find total player credit by agent
      const listOfPlayerWalletId = await playerTable.findAll({
        where: {
          agentRefCode: agentInfo.agentRefCode
        },
        attributes: ['walletId'],
        raw: true
      });

      const playerWalletCollec = mongoConnector.api.collection('player_wallet');
      const totalPlayerWalletSum = await playerWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfPlayerWalletId.map((id) => ObjectId(id.walletId)) }

          }
        },
        {
          $group: { _id: 0, sum: { $sum: "$amount_coin" } },
        },
      ]).toArray();

      resolve(respConvert.successWithData({
        agentName: agentInfo.agentName,
        status: agentInfo.status,
        totalPlayer: totalPlayerOfThisAgent,
        totalPlayerCredit: totalPlayerWalletSum.length == 0 ? 0 : totalPlayerWalletSum[0].sum,
        totalPromotionCredit: 0
      }, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch]: ' + err);
      reject(respConvert.systemError(err.message));
    });

  });
};


/**
 * Get Agent wallet amount by agent Id.
 **/
exports.findAgentWalletById = function (req) {
  return new Promise(function (resolve, reject) {

    const { agentRefCode } = req.body;

    const agentTable = mysqlConnector.agent;

    (async () => {
      const agentWalletId = await agentTable.findOne({
        where: {
          agentRefCode: agentRefCode
        },
        attributes: ['walletId'],
        raw: true
      });

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet');
      const agentWalletAmount = await agentWalletCollec.findOne({
        _id: ObjectId(agentWalletId.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } });

      resolve(respConvert.successWithData(agentWalletAmount, req.newTokenReturn));
    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(new Error(err.message));
    });

  });
};


/**
 * Agent payment request By Owner
 **/
exports.agentPaymentRequestByOwner = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, agentRefCode, promotionId } = req.body;

    if (paymentType && wayToPay && amount) {

      (async () => {

        const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

        console.log(req.user);

        const requestCreate = await agentPaymentReqTable.create(
          {
            agentRefCode: agentRefCode,
            paymentType: paymentType,
            wayToPay: wayToPay,
            amount: amount,
            promotionRefId: !promotionId ? null : promotionId,
            paymentStatus: 'W',
            createBy: req.user.userRefCode,
            createDateTime: new Date(),
            createRoleType: req.user.type,
          }
        );

        resolve(respConvert.success());

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
};

/**
 * List Agent payment request.
 **/
exports.paymentRequestListOfAgent = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { agentRefCode } = req.body;
      console.log('test', req.body);
      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;
      const promotionTable = mysqlConnector.promotion;

      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestListOfAgent = await agentPaymentReqTable.findAll({
        where: {
          agentRefCode: agentRefCode
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          }
        ],
        order: [['createDateTime', 'DESC']],
        raw: true,
        nest: true
      });

      resolve(respConvert.successWithData(paymentRequestListOfAgent, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(respConvert.systemError(err.message));
    });

  });
};

/**
 * List of Agent Payment Request And Sum Deposit& Withdraw.
 **/
exports.agentPaymentRequestListDataAndSum = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;
      const agentTable = mysqlConnector.agent;

      agentPaymentReqTable.belongsTo(agentTable, { foreignKey: 'agentRefCode' });

      const paymentRequestList = await agentPaymentReqTable.findAll({
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: agentTable,
            attributes: ['agentRefCode', 'agentName'],
          }
        ],
        order: [['createDateTime', 'DESC']],
        raw: true,
        nest: true
      });

      const responseData = {};
      if (paymentRequestList.length !== 0) {
        responseData.agentPaymentRequestList = paymentRequestList;
      } else {
        responseData.agentPaymentRequestList = [];
      }

      const sumDepositAmount = await agentPaymentReqTable.sum('payment_amount', {
        where: {
          approvedBy: req.user.userRefCode,
          paymentType: 'DP',
          paymentStatus: 'A',
        }
      });
      const sumWithdrawAmount = await agentPaymentReqTable.sum('payment_amount', {
        where: {
          approvedBy: req.user.userRefCode,
          paymentType: 'WD',
          paymentStatus: 'A',
        }
      });

      responseData.sumDeposit = sumDepositAmount;
      responseData.sumWithdraw = sumWithdrawAmount;

      resolve(respConvert.successWithData(responseData, req.newTokenReturn));
    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(respConvert.systemError(err.message));
    });

  });
};


/**
 * Get payment detail from page agent-detail payment request list table.
 **/
exports.getAgentPaymentDetailById = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { paymentId } = req.body;
      const agentPaymentReq = mysqlConnector.agentPaymentReq;
      const agentTable = mysqlConnector.agent;

      agentPaymentReq.belongsTo(agentTable, { foreignKey: 'agentRefCode' });

      const paymentDetail = await agentPaymentReq.findOne({
        where: {
          id: paymentId
        },
        attributes: ['id', 'createDateTime', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: agentTable,
            attributes: ['agentName'],
          }
        ],
        raw: true,
        nest: true
      });

      resolve(respConvert.successWithData(paymentDetail, req.newTokenReturn));
    })().catch(function (err) {
      reject(respConvert.systemError(err.message));
    });
  });
};


/**
 * Approve agent payment request by Owner.
 **/
exports.approveAgentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body;

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const agentPaymentReq = mysqlConnector.agentPaymentReq;
        const agentTable = mysqlConnector.agent;

        //Find record for agent ref code 
        const findUpdateRecordData = await agentPaymentReq.findOne({
          where: {
            id: id
          },
          attributes: ['agentRefCode'],
          raw: true
        });

        //get Agent wallet id for update wallet
        const agentData = await agentTable.findOne({
          where: {
            agentRefCode: findUpdateRecordData.agentRefCode
          },
          attributes: ['walletId', 'username'],
          raw: true
        });

        //check agent wallet amount
        const agentWalletCollec = mongoConnector.api.collection('agent_wallet');

        let updateAgentWalletQry = {};
        if (paymentType == 'WD') {

          updateAgentWalletQry.amount_coin = -Math.abs(amount);

          const resAgentWalletAmount = await agentWalletCollec.findOne({
            _id: ObjectId(agentData.walletId)
          }, { projection: { _id: 0, amount_coin: 1 } });

          //reject if agent wallet not enough for withdraw
          if (resAgentWalletAmount.amount_coin < amount) return reject(respConvert.businessError(msgConstant.agent.credit_not_enough));
        } else {
          updateAgentWalletQry.amount_coin = amount;
        }

        //Update agent wallet

        await agentWalletCollec.updateOne({
          _id: ObjectId(agentData.walletId)
        },
          { $inc: updateAgentWalletQry }
        );

        //update status of payment request
        await agentPaymentReq.update(
          {
            approvedBy: 1,
            approvedBy: req.user.userRefCode,
            approveDateTime: new Date(),
            paymentStatus: 'A'
          },
          {
            where: { id: id }
          }
        );

        resolve(respConvert.success(req.newTokenReturn));

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
};


/**
 * Disapprove agent payment request by Owner .
 **/
exports.disapproveAgentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body;

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const agentPaymentReq = mysqlConnector.agentPaymentReq;

        //update status of payment request
        await agentPaymentReq.update(
          {
            paymentStatus: 'D'
          },
          {
            where: { id: id }
          }
        );

        resolve(respConvert.success(req.newTokenReturn));

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
};

/**
 * Cancel agent payment request by Owner .
 **/
exports.cancelAgentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body;

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const agentPaymentReq = mysqlConnector.agentPaymentReq;

        //update status of payment request
        await agentPaymentReq.update(
          {
            paymentStatus: 'C'
          },
          {
            where: { id: id }
          }
        );

        resolve(respConvert.success(req.newTokenReturn));

      })().catch(function (err) {
        console.log('[error on catch] : ' + err);
        reject(respConvert.systemError(err.message));
      });

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
};
/************************ Agent Operation By Owner*************************/
