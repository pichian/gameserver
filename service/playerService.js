'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb");
const utilLog = require("../utils/log")
const strUtil = require("../utils/String")
const commUtil = require("../utils/common");
const employee = require('../model/employee');

/***************** Service by Player **************/

/**
 * Logged Player into the system.
 **/
exports.loginPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { username, password } = body

    if (username && password) {

      (async () => {

        const playerTable = mysqlConnector.player
        const sessionPlayerTable = mysqlConnector.sessionPlayer

        //find player user detail
        const resPlayer = await playerTable.findOne({
          where: {
            username: username,
            status: 'active'
          },
          attributes: ['username', 'password', 'playerName', 'playerRefCode', 'agentRefCode'],
          raw: true
        });

        //if player username not found.
        if (!resPlayer) return reject(respConvert.businessError(msgConstant.core.login_failed))

        //if username and password is true.
        if (resPlayer && await bcrypt.compare(password, resPlayer.password)) {

          const findSessionPlayer = await sessionPlayerTable.findOne({
            where: {
              playerCode: resPlayer.playerRefCode,
              status: 'Y'
            },
            raw: true
          });

          //if this user is already logged in system.
          if (findSessionPlayer) {
            // update status of old session and token to 'N' that mean
            // this token is not valid now.
            const updateSessionStatus = sessionPlayerTable.update({ status: "N" }, {
              where: {
                playerCode: findSessionPlayer.playerCode
              }
            })
          }

          const token = jwt.sign(
            {
              name: resPlayer.playerName,
              username: resPlayer.username,
              userRefCode: resPlayer.playerRefCode,
              agentRefCode: resPlayer.agentRefCode,
              type: 'Player'
            },
            process.env.JWT_TOKEN_SECRET_KEY,
            { expiresIn: '30m' }
          );

          const addTokenToSession = await sessionPlayerTable.create({
            playerCode: resPlayer.playerRefCode,
            token: token,
            status: 'Y'
          });

          resolve(respConvert.successWithToken(token));
        } else {
          //if password wrong.
          return reject(respConvert.businessError(msgConstant.core.login_failed))
        }

      })().catch(function (err) {
        console.log('[error on catchddd] : ' + err)
        reject(respConvert.systemError(err.message))
      })
    } else {
      reject(respConvert.businessError(msgConstant.core.invalid_token));
    }

  });
}


/**
 * Logged out player from system and also remove session.
 **/
exports.logoutPlayer = function (req) {
  return new Promise(function (resolve, reject) {

    const token = req.headers['authorization'].split(" ")[1];

    if (token) {

      (async () => {
        const decoded = jwt.decode(token);

        if (decoded == null) return reject(respConvert.businessError(msgConstant.core.invalid_token));

        const sessionPlayerTable = mysqlConnector.sessionPlayer
        const updatePlayerSessionLogout = await sessionPlayerTable.update({ status: 'N' }, {
          where: {
            playerCode: decoded.userRefCode,
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
 * Register player from main page.
 **/
exports.registerPlayer = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerName, username, password, phoneNumber, agentRefCode } = req.body;

    if (playerName && username && password && phoneNumber && (agentRefCode || agentRefCode === "")) {

      (async () => {

        const playerTable = mysqlConnector.player
        const sequenceNow = await commUtil.getRefCodeSequence()

        //Check duplicate player name and username
        const duplicatedPlayer = await playerTable.findOne({
          where: {
            [Op.or]: [
              {
                playerName: playerName,
              },
              {
                username: username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (duplicatedPlayer) {
          return reject(respConvert.businessError(msgConstant.player.duplicate_player))
        }

        //Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        //Register Player 
        const resCreatedPlayer = await playerTable.create({
          playerRefCode: 'py' + strUtil.paddingNumberWithDate(sequenceNow, 5),
          playerName: playerName,
          username: username,
          password: encryptedPassword,
          phoneNumber: phoneNumber,
          agentRefCode: agentRefCode,
          createRoleType: 'Player',
          status: 'active'
        });

        // create player wallet on mongo
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await playerWalletCollec.insertOne({
          playerRefCode: resCreatedPlayer.playerRefCode,
          amount_coin: 0,
        })

        //update player wallet id
        const updatePlayerWallet = await playerTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { playerRefCode: resCreatedPlayer.playerRefCode }
          })

        //update sequence
        await commUtil.updateRefCodeSequence()

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
 * Get player info include player name, amount coin.
 **/
exports.getPlayerInfo = function (req) {
  return new Promise(function (resolve, reject) {

    const userData = req.user;

    (async () => {

      const playerTable = mysqlConnector.player

      const playerInfo = await playerTable.findOne({
        where: {
          playerRefCode: userData.userRefCode
        },
        attributes: ['playerName', 'status'],
        raw: true
      });

      resolve(respConvert.successWithData({ playerName: playerInfo.playerName }, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch]: ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}


/**
 * Get player info amount coin.
 **/
exports.getPlayerWallet = function (req) {
  return new Promise(function (resolve, reject) {

    const userData = req.user;

    (async () => {

      const playerTable = mysqlConnector.player

      const playerInfo = await playerTable.findOne({
        where: {
          playerRefCode: userData.userRefCode
        },
        attributes: ['walletId'],
        raw: true
      });

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')

      const playerWalletAmount = await playerWalletCollec.findOne({
        _id: ObjectId(playerInfo.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } })

      resolve(respConvert.successWithData({ amountCoin: playerWalletAmount.amount_coin }, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] hh: ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}


/**
 * Player payment request from main page amd agent page
 **/
exports.playerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, playerRefCode, promotionId } = req.body

    if (paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq
        const employeeTable = mysqlConnector.employee
        const playerTable = mysqlConnector.player
        console.log('req user', req.user)

        //check type of user that register player
        let agentRefCode = null
        if (req.user.type.toLowerCase() == 'agent') {
          agentRefCode = req.user.userRefCode
        } else if (req.user.type.toLowerCase() == 'employee') {
          //find employee agent ref code
          const employeeData = await employeeTable.findOne({
            where: {
              employeeRefCode: req.user.userRefCode
            },
            attributes: ['agentRefCode'],
            raw: true
          })
          agentRefCode = employeeData.agentRefCode
        }
        else if (req.user.type.toLowerCase() == 'player') {
          //find employee agent ref code
          const playerData = await playerTable.findOne({
            where: {
              playerRefCode: req.user.userRefCode
            },
            attributes: ['agentRefCode'],
            raw: true
          })
          agentRefCode = playerData.agentRefCode
        } else {
          console.log('other Role created')
        }


        const requestCreate = await playerPaymentReqTable.create(
          {
            playerRefCode: !playerRefCode ? req.user.userRefCode : playerRefCode,
            paymentType: paymentType,
            wayToPay: wayToPay,
            amount: amount,
            promotionRefId: !promotionId ? null : promotionId,
            paymentStatus: 'W',
            createBy: req.user.userRefCode,
            createDateTime: new Date(),
            updateBy: req.user.userRefCode,
            updateDateTime: new Date(),
            createRoleType: req.user.type,
            agentRefCode: agentRefCode
          }
        )

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
 * Get payment detail from page agent-detail payment request list table.
 **/
exports.getPlayerPaymentDetailById = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { paymentId } = req.body

      const playerPaymentReqTable = mysqlConnector.playerPaymentReq;
      const playerTable = mysqlConnector.player

      playerPaymentReqTable.belongsTo(playerTable, { foreignKey: 'playerRefCode' });

      const paymentDetail = await playerPaymentReqTable.findOne({
        where: {
          id: paymentId
        },
        attributes: ['id', 'createDateTime', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: playerTable,
            attributes: ['playerName'],
          }
        ],
        raw: true,
        nest: true
      })

      resolve(respConvert.successWithData(paymentDetail, req.newTokenReturn))
    })().catch(function (err) {
      reject(respConvert.systemError(err.message))
    })
  });
}


/**
 * List of player payment request in player page.
 **/
exports.listPlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {
      const playerPaymentReqTable = mysqlConnector.playerPaymentReq

      const paymentReqList = await playerPaymentReqTable.findAll({
        where: {
          playerRefCode: req.user.userRefCode
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus', 'createDateTime'],
        order: [['createDateTime', 'DESC']],
        limit: 5,
        raw: true
      });

      resolve(respConvert.successWithData(paymentReqList, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })
  });
}











/***************** Service by Agent **************/

/**
 * Register Player by Agent.
 **/
exports.agentPlayerRegister = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerName, phoneNumber, username, password, description, status } = req.body

    if (playerName && phoneNumber && username && password && description || description == '' && status) {
      (async () => {

        const playerTable = mysqlConnector.player
        const employeeTable = mysqlConnector.employee
        const sequenceNow = await commUtil.getRefCodeSequence()

        const checkDuplucatedUsername = await playerTable.findOne({
          where: {
            [Op.or]: [
              {
                playerName: playerName,
              },
              {
                username: username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          reject(respConvert.businessError(msgConstant.agent.duplicate_user))
        }

        //check type of user that register player
        let agentRefCode = null
        if (req.user.type.toLowerCase() == 'agent') {
          agentRefCode = req.user.userRefCode
        } else if (req.user.type.toLowerCase() == 'employee') {
          //find employee agent ref code
          const employeeData = await employeeTable.findOne({
            where: {
              employeeRefCode: req.user.userRefCode
            },
            attributes: ['agentRefCode'],
            raw: true
          })
          agentRefCode = employeeData.agentRefCode
        } else {
          console.log('other Role created')
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const playerCreatedByAgent = await playerTable.create({
          playerRefCode: 'py' + strUtil.paddingNumberWithDate(sequenceNow, 5),
          playerName: playerName,
          username: username,
          password: encryptedPassword,
          phoneNumber: phoneNumber,
          description: description,
          status: status,
          createRoleType: req.user.type,
          agentRefCode: agentRefCode,
          createBy: req.user.userRefCode,
          createDateTime: new Date(),
          updateBy: req.user.userRefCode,
          updateDateTime: new Date(),
        });

        //update sequence
        await commUtil.updateRefCodeSequence()

        // create player wallet on mongo
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await playerWalletCollec.insertOne({
          player_code: playerCreatedByAgent.playerRefCode,
          amount_coin: 0,
        })

        //update player wallet id
        const updatePlayerWallet = await playerTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { playerRefCode: playerCreatedByAgent.playerRefCode }
          })

        //(type, ref, desc, userId, createBy) 
        await utilLog.agentLog('register', null, 'player', playerCreatedByAgent.playerRefCode, req.user.userRefCode)

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
 * List Player by agent id.
 *
 **/
exports.listPlayerByAgentId = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const playerTable = mysqlConnector.player;
      const employeeTable = mysqlConnector.employee

      //check user type for where Query
      let whereQry = {}
      if (req.user.type.toLowerCase() == 'agent') {
        whereQry.agentRefCode = req.user.userRefCode;
      } else if (req.user.type.toLowerCase() == 'employee') {
        const agentRefCodeOfEmployee = await employeeTable.findOne({
          where: {
            employeeRefCode: req.user.userRefCode
          },
          attributes: ['agentRefCode'],
          raw: true
        })

        whereQry.agentRefCode = agentRefCodeOfEmployee.agentRefCode;
      } else {
        console.log('other role type')
      }

      const playerList = await playerTable.findAll({
        where: whereQry,
        attributes: ['playerRefCode', 'playerName', 'phoneNumber', 'username', 'ranking', 'status', 'walletId'],
        order: [['createDateTime', 'DESC']],
        raw: true
      })

      const listOfPlayerWalletId = playerList.map((player) => ObjectId(player.walletId))

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')
      const resultOfPlayerWalletAmount = await playerWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfPlayerWalletId }

          }
        },
      ]).toArray()

      const returnDataMatchedCredit = playerList.map((player) => {
        return resultOfPlayerWalletAmount.reduce((acc, curr) => {
          if (player.walletId === curr._id.toString()) {
            return {
              ...player,
              credit: parseFloat(curr.amount_coin),
            };
          }
          return acc;
        },
          {
            playerRefCode: player.playerRefCode,
            playerName: player.playerName,
            phoneNumber: player.phoneNumber,
            username: player.username,
            ranking: player,
            status: player.status,
            walletId: player.walletId
          })
      })

      resolve(respConvert.successWithData(returnDataMatchedCredit, req.newTokenReturn))

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * List player payment request all.
 * This table is in Player/Payment request list page.
 **/
exports.listPlayerPaymentRequestAll = function (req) {

  return new Promise(function (resolve, reject) {
    (async () => {

      const playerPaymentReqTable = mysqlConnector.playerPaymentReq
      const promotionTable = mysqlConnector.promotion
      const playerTable = mysqlConnector.player
      const employeeTable = mysqlConnector.employee

      playerPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });
      playerPaymentReqTable.belongsTo(playerTable, { foreignKey: 'playerRefCode' });

      //check user role for where qry
      let whereQry = {}
      if (req.user.type.toLowerCase() == 'agent') {
        whereQry.agentRefCode = req.user.userRefCode
      } else if (req.user.type.toLowerCase() == 'employee') {
        //find employee agent ref code
        const employeeData = await employeeTable.findOne({
          where: { employeeRefCode: req.user.userRefCode },
          attributes: ['agentRefCode'],
          raw: true
        })
        whereQry.agentRefCode = employeeData.agentRefCode
      } else {
        whereQry.agentRefCode = req.user.userRefCode
      }

      const paymentRequestList = await playerPaymentReqTable.findAll({
        where: whereQry,
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        order: [['createDateTime', 'DESC']],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          },
          {
            model: playerTable,
            attributes: ['playerName', 'playerRefCode'],
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

/**
 * List player payment request of each Player.
 **/
exports.paymentRequestListOfPlayer = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const { playerRefCode } = req.body

      console.log(req.body)

      const playerPaymentReqTable = mysqlConnector.playerPaymentReq
      const promotionTable = mysqlConnector.promotion

      playerPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestListOfPlayer = await playerPaymentReqTable.findAll({
        where: {
          playerRefCode: playerRefCode
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
      })

      resolve(respConvert.successWithData(paymentRequestListOfPlayer, req.newTokenReturn));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}

/**
 * Agent get Player wallet amount by Player Id.
 **/
exports.findPlayerWalletById = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerRefCode } = req.body

    const playerTable = mysqlConnector.player;

    (async () => {
      const playerWalletId = await playerTable.findOne({
        where: {
          playerRefCode: playerRefCode
        },
        attributes: ['wallet_id'],
        raw: true
      })

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')

      const playerWalletAmount = await playerWalletCollec.findOne({
        _id: ObjectId(playerWalletId.wallet_id)
      }, { projection: { _id: 0, amount_coin: 1 } })

      resolve(respConvert.successWithData(playerWalletAmount, req.newTokenReturn))
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * Agent get Player rand and status.
 **/
exports.findPlayerInfo = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerRefCode } = req.body

    const playerTable = mysqlConnector.player;

    (async () => {
      const playerInfo = await playerTable.findOne({
        where: {
          playerRefCode: playerRefCode
        },
        attributes: ['ranking', 'status', 'playerName'],
        raw: true
      })

      console.log(playerInfo)
      resolve(respConvert.successWithData(playerInfo, req.newTokenReturn))
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * Approve player payment request by Agent or Employee .
 **/
exports.approvePlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq
        const playerTable = mysqlConnector.player
        const agentTable = mysqlConnector.agent

        //Find record for player id 
        const findUpdateRecordData = await playerPaymentReqTable.findOne({
          where: {
            id: id
          },
          attributes: ['playerRefCode', 'createBy', 'createRoleType', 'approved_by'],
          raw: true
        })

        //get player wallet id for update wallet
        const playerData = await playerTable.findOne({
          where: {
            playerRefCode: findUpdateRecordData.playerRefCode
          },
          attributes: ['walletId', 'username', 'agentRefCode', 'playerRefCode'],
          raw: true
        })

        const agentData = await agentTable.findOne({
          where: {
            agentRefCode: playerData.agentRefCode
          },
          attributes: ['walletId', 'username'],
          raw: true
        })

        console.log(playerData, agentData)

        let updatePlayerWalletQry = {}, updateAgentWalletQry = {}
        if (paymentType == 'WD') {
          //check player wallet amount
          const playerWalletCollec = mongoConnector.api.collection('player_wallet')
          const resPlayerWalletAmount = await playerWalletCollec.findOne({
            _id: ObjectId(playerData.walletId)
          }, { projection: { _id: 0, amount_coin: 1 } })

          //reject if player wallet not enough for withdraw
          if (resPlayerWalletAmount.amount_coin < amount) return reject(respConvert.businessError(msgConstant.player.credit_not_enough))

          updatePlayerWalletQry.amount_coin = -Math.abs(amount)
        } else {
          //check Agent wallet amount
          const agentWallerCollec = mongoConnector.api.collection('agent_wallet')
          const resAgentWalletAmount = await agentWallerCollec.findOne({
            _id: ObjectId(agentData.walletId)
          }, { projection: { _id: 0, amount_coin: 1 } })

          //reject if Agent wallet not enough for withdraw
          if (resAgentWalletAmount.amount_coin < amount) return reject(respConvert.businessError(msgConstant.agent.credit_not_enough))

          updateAgentWalletQry.amount_coin = -Math.abs(amount)
          updatePlayerWalletQry.amount_coin = amount

          //update agent wallet
          await agentWallerCollec.updateOne({
            _id: ObjectId(agentData.walletId)
          },
            { $inc: updateAgentWalletQry }
          )

        }

        //update player wallet
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        await playerWalletCollec.updateOne({
          _id: ObjectId(playerData.walletId)
        },
          { $inc: updatePlayerWalletQry }
        )

        //update status of payment request
        await playerPaymentReqTable.update(
          {
            approvedBy: req.user.userRefCode,
            approveDateTime: new Date(),
            updateBy: req.user.userRefCode,
            updateDateTime: new Date(),
            paymentStatus: 'A'
          },
          {
            where: { id: id }
          }
        )

        const textDesc = 'Approved ' + strUtil.getPaymentTypeText(paymentType) + ' ' + playerData.username
        let logsCreateBy = null;
        if (req.user.type.toLowerCase() == 'employee') {
          logsCreateBy = req.user.userRefCode;
          await utilLog.employeeLog(findUpdateRecordData.playerRefCode, 'pay', id, textDesc, logsCreateBy)
        } else if (req.user.type.toLowerCase() == 'agent') {
          logsCreateBy = req.user.userRefCode
          await utilLog.agentLog('pay', id, textDesc, findUpdateRecordData.playerRefCode, logsCreateBy)
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
 * Disapprove player payment request by Agent .
 **/
exports.disapprovePlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq
        const playerTable = mysqlConnector.player

        //update status of payment request
        await playerPaymentReqTable.update(
          {
            paymentStatus: 'D'
          },
          {
            where: { id: id }
          }
        )

        //Find record for player id 
        const findUpdateRecordData = await playerPaymentReqTable.findOne({
          where: {
            id: id
          },
          attributes: ['playerRefCode', 'createBy', 'createRoleType', 'approved_by'],
          raw: true
        })

        //Find record for player id 
        const playerPaymentData = await playerPaymentReqTable.findOne({
          where: {
            id: id
          },
          attributes: ['playerRefCode', 'createRoleType', 'createBy'],
          raw: true
        })

        //get player info
        const playerData = await playerTable.findOne({
          where: {
            playerRefCode: playerPaymentData.playerRefCode
          },
          attributes: ['username'],
          raw: true
        })

        console.log(playerPaymentData)
        const textDesc = 'Approved ' + strUtil.getPaymentTypeText(paymentType) + ' ' + playerData.username
        let logsCreateBy = null;
        if (req.user.type.toLowerCase() == 'employee') {
          logsCreateBy = req.user.userRefCode;
          await utilLog.employeeLog(findUpdateRecordData.playerRefCode, 'pay', id, textDesc, logsCreateBy)
        } else if (req.user.type.toLowerCase() == 'agent') {
          logsCreateBy = req.user.userRefCode
          await utilLog.agentLog('pay', id, textDesc, findUpdateRecordData.playerRefCode, logsCreateBy)
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
 * Cancel player payment request by Agent .
 **/
exports.cancelPlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq

        //update status of payment request
        await playerPaymentReqTable.update(
          {
            paymentStatus: 'C'
          },
          {
            where: { id: id }
          }
        )

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
 * Ban player by agent.
 **/
exports.banPlayer = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerRefCode } = req.body

    if (playerRefCode) {

      (async () => {

        const playerTable = mysqlConnector.player
        const sessionPlayer = mysqlConnector.sessionPlayer

        await playerTable.update(
          {
            status: 'banned',
            updateBy: req.user.userRefCode,
            updateDateTime: new Date()
          },
          {
            where: { playerRefCode: playerRefCode }
          }
        )

        await sessionPlayer.update({
          status: 'N'
        }, {
          where: { playerCode: playerRefCode }
        })

        const playerData = await playerTable.findOne({
          where: { playerRefCode: playerRefCode },
          raw: true,
          attributes: ['playerName']
        })

        if (req.user.type.toLowerCase() == "agent") {
          //(type, ref, desc, userId, createBy) 
          await utilLog.agentLog('ban', null, 'player', playerData.playerName, req.user.userRefCode)
        } else if (req.user.type.toLowerCase() == "employee") {
          await utilLog.employeeLog(playerRefCode, 'ban', null, 'Ban player ' + playerData.playerName, req.user.userRefCode)
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
 * Un Ban player by agent.
 **/
exports.unBanPlayer = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerRefCode } = req.body

    if (playerRefCode) {

      (async () => {

        const playerTable = mysqlConnector.player

        await playerTable.update(
          {
            status: 'active',
            updateBy: req.user.userRefCode,
            updateDateTime: new Date()
          },
          {
            where: { playerRefCode: playerRefCode }
          }
        )

        const playerData = await playerTable.findOne({
          where: { playerRefCode: playerRefCode },
          raw: true,
          attributes: ['playerName']
        })

        if (req.user.type.toLowerCase() == "agent") {
          //(type, ref, desc, userId, createBy) 
          await utilLog.agentLog('unban', null, 'player', playerData.playerName, req.user.userRefCode)
        } else if (req.user.type.toLowerCase() == "employee") {
          await utilLog.employeeLog(playerRefCode, 'unban', null, 'Unban player ' + playerData.playerName, req.user.userRefCode)
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
 * List Player by owner.
 *
 **/
exports.listPlayer = function (req) {
  return new Promise(function (resolve, reject) {

    const playerTable = mysqlConnector.player;

    (async () => {

      const playerList = await playerTable.findAll({
        attributes: ['playerRefCode', 'playerName', 'phoneNumber', 'username', 'ranking', 'status', 'walletId'],
        order: [['createDateTime', 'DESC']],
        raw: true
      })

      const listOfPlayerWalletId = playerList.map((player) => ObjectId(player.walletId))

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')
      const resultOfPlayerWalletAmount = await playerWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfPlayerWalletId }
          }
        },
      ]).toArray()

      const returnDataMatchedCredit = playerList.map((player) => {
        return resultOfPlayerWalletAmount.reduce((acc, curr) => {
          if (player.walletId === curr._id.toString()) {
            return {
              ...player,
              credit: parseFloat(curr.amount_coin),
            };
          }
          return acc;
        },
          {
            playerRefCode: player.playerRefCode,
            playerName: player.playerName,
            phoneNumber: player.phoneNumber,
            username: player.username,
            ranking: player,
            status: player.status,
            walletId: player.walletId
          })
      })

      resolve(respConvert.successWithData(returnDataMatchedCredit, req.newTokenReturn))

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * Player lotto history in player page.
 *
 **/
exports.playerLottoHistory = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const playerLottoCollec = mongoConnector.lottogame.collection('tbt_player_lotto')
      const playerLottoHistory = await playerLottoCollec.aggregate([
        {
          $match: { playerRefCode: req.user.userRefCode }
        },
        {
          $lookup: {
            from: "tbt_lotto_round",
            localField: "betRoundId",
            foreignField: "_id",
            as: "lottoRoundData",
          },
        },
        { $sort: { createDateTime: -1 } },
        {
          $project: {
            category: 1, betNumber: 1, betCredit: 1, betStatus: 1, roundName: "$lottoRoundData.roundName"
          }
        },
        { $unwind: "$roundName" },
        { $limit: 5 },
      ]).toArray()

      resolve(respConvert.successWithData(playerLottoHistory, req.newTokenReturn))

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}