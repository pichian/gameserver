'use strict';
const { Op } = require("sequelize");
const { ObjectID } = require('bson');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");

/***************** Service by Agent **************/

/**
 * Logged in agent into the system
 **/
exports.loginAgent = function (body) {
  return new Promise(function (resolve, reject) {
    const { username, password } = body

    if (username && password && body !== 'undefined') {

      (async () => {

        const agentTable = mysqlConnector.agent;
        const sessionAgentTable = mysqlConnector.sessionAgent;

        const resAgent = await agentTable.findOne({
          where: {
            username: username,
          },
          attributes: ['id', 'username', 'password', 'agentName'],
          raw: true
        });

        if (!resAgent) return reject(respConvert.businessError(msgConstant.core.login_failed))

        // if username and password is true
        if (resAgent && await bcrypt.compare(password, resAgent.password)) {

          const findSessionAgent = await sessionAgentTable.findOne({
            where: {
              agentId: resAgent.id,
              status: 'Y'
            },
            raw: true
          });

          //if this user is already logged in system.
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

          const token = jwt.sign(
            {
              id: resAgent.id,
              name: resAgent.agentName,
              username: resAgent.username,
              type: 'Agent'
            },
            process.env.JWT_TOKEN_SECRET_KEY,
            { expiresIn: '30m' }
          );

          const addTokenToSession = await sessionAgentTable.create({
            agentId: resAgent.id,
            token: token,
            status: 'Y'
          });

          resolve(respConvert.successWithToken(token));

        } else {
          return reject(respConvert.businessError(msgConstant.core.login_failed))
        }
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

        const sessionAgentTable = mysqlConnector.sessionAgent
        const updateAgentSessionLogout = await sessionAgentTable.update({ status: 'N' }, {
          where: {
            agentId: decoded.id,
            token: token,
          }
        });

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

      const agentInfo = await agentTable.findOne({
        where: {
          id: userData.id
        },
        attributes: ['agentName', 'walletId'],
        raw: true
      });

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet')

      const agentWalletAmount = await agentWalletCollec.findOne({
        _id: ObjectID(agentInfo.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } })

      //find total player by agent

      //find total player credit by agent

      //find total promotion credit

      //!!!some data of this resolve still be mock data!!!!
      resolve(respConvert.successWithData({
        agentName: agentInfo.agentName,
        amountCoin: agentWalletAmount.amount_coin,
        totalPlayer: 0,
        totalPlayerCredit: 0,
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
 **/
exports.agentPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, paymentAmount, promotionId } = req.body

    if (paymentType && wayToPay && paymentAmount && (promotionId || promotionId === 0 || promotionId === 'default')) {

      (async () => {

        const agentPaymentReqTable = mysqlConnector.agentPaymentReq;

        const patmentReqCreated = await agentPaymentReqTable.create({
          agentId: req.user.id,
          paymentType: paymentType,
          wayToPay: wayToPay,
          amount: paymentAmount,
          promotionRefId: promotionId === 0 || promotionId === 'default' ? null : promotionId,
          paymentStatus: 'W',
          createBy: req.user.id,
          createDateTime: new Date()
        })

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
 * payment player detail
 * Returns a single pet
 *
 * playerPaymentId Long ID of pet to return
 * returns PlayerModel
 **/
exports.approvePlayerPayment = function (playerPaymentId) {
  return new Promise(function (resolve, reject) {

    (async () => {
      const payment = dbPlayer.Payment;
      const paymentlist = await payment.update({ status: 1 }, {
        where: {
          id: {
            [Op.eq]: playerPaymentId
          }
        }
      });
      if (paymentlist[0] === 1) {
        resolve({ "detail": "ok" });
      } else {
        resolve({ "detail": "not ok" });
      }
    })();
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
 * payment detail
 * Returns a single pet
 *
 * paymentId Long ID of pet to return
 * returns PlayerModel
 **/
exports.getPaymentDetail = function (paymentId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "firstName": "firstName",
      "lastName": "lastName",
      "password": "password",
      "userStatus": [{
        "key": ""
      }, {
        "key": ""
      }],
      "refCodeAgent": "refCodeAgent",
      "phone": "phone",
      "id": 0,
      "email": "email",
      "username": "username"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
 * List agent payment request
 *
 * no response value expected for this operation
 **/
exports.listAgentPaymentRequest = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

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
 * List agent payment request
 *
 * no response value expected for this operation
 **/
exports.listplayerPaymentRequestagent = function () {
  return new Promise(function (resolve, reject) {
    const payment = dbPlayer.Payment;
    (async () => {
      const paymentlist = await payment.findAll({
        where: {
          status: {
            [Op.eq]: 0
          }
        }
      });
      resolve(paymentlist);

    })();
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


/**
 * register Agent for test login
 *
 * body PlayerModel register new player witch agent refcode
 * no response value expected for this operation
 **/
exports.registerAgent = function (body) {
  return new Promise(function (resolve, reject) {

    const { agentName, email, phoneNumber, username, password, description, status, agentRefCode } = body

    if (agentName && email && phoneNumber && username && password && description || description == "" && status && agentRefCode || agentRefCode == "") {

      (async () => {
        const agentTable = mysqlConnector.agent

        const checkDuplucatedUsername = await agentTable.findOne({
          where: {
            [Op.or]: [
              {
                email: email,
              },
              {
                username: username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          return reject(respConvert.businessError(msgConstant.agent.duplicate_user))
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const resCretedAgent = await agentTable.create({
          agentName: agentName,
          username: username,
          password: encryptedPassword,
          email: email,
          phoneNumber: phoneNumber,
          description: description,
          agentRefCode: agentRefCode,
          status: status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });

        // create agent wallet on mongo
        const agentWalletCollec = mongoConnector.api.collection('agent_wallet')
        const resCreatedWallet = await agentWalletCollec.insertOne({
          agent_id: resCretedAgent.id,
          amount_coin: 0,
        })

        //update agent wallet id
        const updateAgentWallet = await agentTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { id: resCretedAgent.id }
          })

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