'use strict';
const { Op, Sequelize } = require("sequelize");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector");
const mongoConnector = require("../connector/mongodb");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const envConstant = require("../constant/env");
const strUtil = require("../utils/String");
const commUtil = require("../utils/common");

/**
 * Logged in owner into the system
 **/
exports.loginOwner = function (body) {
  return new Promise(function (resolve, reject) {
    const { username, password } = body;

    console.log(username, password);
    if (username && password && body !== 'undefined') {
      (async () => {

        const ownerTable = mysqlConnector.owner;
        const sessionOwner = mysqlConnector.sessionOwner;

        const resOwner = await ownerTable.findOne({
          where: {
            username: username,
          },
          attributes: ['username', 'password', 'displayName', 'firstname', 'lastname', 'userRefCode', 'rtype'],
          raw: true
        });

        // if username and password of Owner is true
        if (resOwner !== null) {
          if (await bcrypt.compare(password, resOwner.password)) {

            const findSessionOwner = await sessionOwner.findOne({
              where: {
                ownerCode: resOwner.userRefCode,
                status: 'Y'
              },
              raw: true
            });



            //if this Owner is already logged in system.
            if (findSessionOwner) {
              // update status of old session and token to 'N' that mean
              // this token is not valid now.
              const updateSessionStatus = sessionOwner.update({ status: "N" }, {
                where: {
                  ownerCode: findSessionOwner.ownerCode
                }
              });
            }

            let token;
            if (resOwner) {
              token = jwt.sign(
                {
                  name: resOwner.displayName,
                  username: resOwner.username,
                  type: resOwner.rtype == 'owner' ? 'Owner' : 'Manager',
                  userRefCode: resOwner.userRefCode
                },
                envConstant.env.JWT_TOKEN_SECRET_KEY,
                { expiresIn: '30m' }
              );

              console.log('this call' + JSON.stringify(resOwner));

              const addTokenToSession = await sessionOwner.create({
                ownerCode: resOwner.userRefCode,
                token: token,
                status: 'Y',
                createDateTime: new Date()
              });
            }

            resolve(respConvert.successWithToken(token));
          } else {
            return reject(respConvert.businessError(msgConstant.core.login_failed));
          }
        } else {
          return reject(respConvert.businessError(msgConstant.core.login_failed));
        }
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
 * Logged out agent from system and session.
 **/
exports.logoutOwner = function (req) {
  return new Promise(function (resolve, reject) {

    const token = req.headers['authorization'].split(" ")[1];

    if (token) {
      (async () => {

        const decoded = jwt.decode(token);

        if (decoded == null) return reject(respConvert.businessError(msgConstant.core.invalid_token));

        const sessionOwner = mysqlConnector.sessionOwner;
        const updateAgentSessionLogout = await sessionOwner.update({ status: 'N' }, {
          where: {
            ownerCode: decoded.userRefCode,
            token: token,
          }
        });

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
 * Finds Owner detail include wallet amount, sum player wallet.
 **/
exports.findOwnerDetail = function (req) {
  return new Promise(function (resolve, reject) {

    const userData = req.user;

    (async () => {

      const ownerTable = mysqlConnector.owner;
      const agentTable = mysqlConnector.agent;

      const ownerInfo = await ownerTable.findOne({
        where: {
          userRefCode: userData.userRefCode
        },
        attributes: ['displayName', 'userRefCode'],
        raw: true
      });

      // const agentWalletCollec = mongoConnector.api.collection('agent_wallet')

      // const agentWalletAmount = await agentWalletCollec.findOne({
      //   _id: ObjectId(agentInfo.walletId)
      // }, { projection: { _id: 0, amount_coin: 1 } })

      const totalAgentOfThisOwner = await agentTable.count({
        where: {
          ownerRefCode: ownerInfo.userRefCode
        },
        raw: true
      });

      console.log('Total Agent', totalAgentOfThisOwner);

      const listOfAgentWalletId = await agentTable.findAll({
        where: {
          ownerRefCode: ownerInfo.userRefCode
        },
        attributes: ['walletId'],
        raw: true
      });

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet');
      const totalAgentWalletSum = await agentWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfAgentWalletId.map((id) => ObjectId(id.walletId)) }
          }
        },
        {
          $group: { _id: 0, sum: { $sum: "$amount_coin" } },
        },
      ]).toArray();
      console.log('Sum Agent Wallet', totalAgentWalletSum);
      // //find total promotion credit

      //!!!Warning. Some data of this resolve still mock data!!!!
      resolve(respConvert.successWithData({
        ownerRefCode: ownerInfo.userRefCode,
        // amountCoin: agentWalletAmount.amount_coin,
        totalAgent: totalAgentOfThisOwner,
        totalAgentCredit: totalAgentWalletSum.length == 0 ? 0 : totalAgentWalletSum[0].sum,
      }, req.newTokenReturn)
      );

      // resolve(respConvert.success(req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(respConvert.systemError(err.message));
    });

  });
};

/**
 * owner register Agent (log system unfinished)
 *
 **/
exports.ownerAgentRegister = function (req) {
  return new Promise(function (resolve, reject) {

    const { agentName, email, phoneNumber, username, password, description, status } = req.body;

    if (agentName && email && phoneNumber && username && password && description || description == "" && status) {

      (async () => {
        const agentTable = mysqlConnector.agent;
        const sequenceNow = await commUtil.getRefCodeSequence();

        const checkDuplucatedUsername = await agentTable.findOne({
          where: {
            [Op.or]: [
              {
                agentName: agentName,
              },
              {
                username: username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          return reject(respConvert.businessError(msgConstant.agent.duplicate_user));
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const resCretedAgent = await agentTable.create({
          agentRefCode: 'ag' + strUtil.paddingNumberWithDate(sequenceNow, 5),
          agentName: agentName,
          username: username,
          password: encryptedPassword,
          email: email,
          phoneNumber: phoneNumber,
          description: description,
          ownerRefCode: req.user.userRefCode,
          createRoleType: req.user.type,
          status: status,
          createBy: req.user.userRefCode,
          createDateTime: new Date(),
          updateBy: req.user.userRefCode,
          updateDateTime: new Date(),
        });

        //update sequence
        await commUtil.updateRefCodeSequence();

        // create agent wallet on mongo
        const agentWalletCollec = mongoConnector.api.collection('agent_wallet');
        const resCreatedWallet = await agentWalletCollec.insertOne({
          agent_code: resCretedAgent.agentRefCode,
          amount_coin: 0,
        });

        //update agent wallet id
        const updateAgentWallet = await agentTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { agentRefCode: resCretedAgent.agentRefCode }
          });

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
 * Listagent by owner id.
 *
 **/
exports.listAgentByOwnerId = function (req) {
  return new Promise(function (resolve, reject) {

    const agentTable = mysqlConnector.agent;

    (async () => {
      const agentList = await agentTable.findAll({
        where: {
          ownerRefCode: req.user.userRefCode
        },
        attributes: ['agentRefCode', 'agentName', 'phoneNumber', 'email', 'username', 'ranking', 'status', 'walletId'],
        raw: true
      });

      const listOfAgentWalletId = agentList.map((id) => ObjectId(id.walletId));

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet');
      const resultOfAgentWalletAmount = await agentWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfAgentWalletId }

          }
        },
      ]).toArray();

      const returnDataMatchedCredit = agentList.map((agent) => {
        return resultOfAgentWalletAmount.reduce((acc, curr) => {
          if (agent.walletId === curr._id.toString()) {
            return {
              ...agent,
              credit: parseFloat(curr.amount_coin),
            };
          }
          return acc;
        },
          {
            agentRefCode: agent.agentRefCode,
            playerName: agent.agentName,
            email: agent.email,
            phoneNumber: agent.phoneNumber,
            username: agent.username,
            ranking: agent.ranking,
            status: agent.status,
            walletId: agent.walletId
          });
      });

      resolve(respConvert.successWithData(returnDataMatchedCredit, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err);
      reject(new Error(err.message));
    });

  });
};


/**
 * List agent payment request.
 *
 **/
exports.listAgentPaymentRequestAll = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq;
      const promotionTable = mysqlConnector.promotion;
      const agentTable = mysqlConnector.agent;

      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });
      agentPaymentReqTable.belongsTo(agentTable, { foreignKey: 'agentRefCode' });

      const paymentRequestList = await agentPaymentReqTable.findAll({
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          },
          {
            model: agentTable,
            attributes: ['agentRefCode', 'agentName'],
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



/**
 * Owner Register for testing purpose only
 **/
exports.ownerRegister = function (body) {
  return new Promise(function (resolve, reject) {

    const { ownerName, email, phoneNumber, username, password, description, status } = body;

    if (ownerName && email && phoneNumber && username && password && description || description == "" && status) {

      (async () => {
        const ownerTable = mysqlConnector.owner;

        const checkDuplucatedUsername = await ownerTable.findOne({
          where: {
            [Op.or]: [
              {
                ownerName: ownerName,
              },
              {
                username: username
              },
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          return reject(respConvert.businessError(msgConstant.owner.duplicate_user));
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const resCreateOwner = await ownerTable.create({
          ownerName: ownerName,
          username: username,
          password: encryptedPassword,
          email: email,
          phoneNumber: phoneNumber,
          description: description,
          status: status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });

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