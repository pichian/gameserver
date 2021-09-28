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
const stringUtils = require("../utils/String")

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
          },
          attributes: ['id', 'username', 'password', 'playerName'],
          raw: true
        });

        //if player username not found.
        if (!resPlayer) return reject(respConvert.businessError(msgConstant.core.login_failed))

        //if username and password is true.
        if (resPlayer && await bcrypt.compare(password, resPlayer.password)) {

          const findSessionPlayer = await sessionPlayerTable.findOne({
            where: {
              playerId: resPlayer.id,
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
                id: findSessionPlayer.id,
                playerId: findSessionPlayer.playerId
              }
            })
          }

          const token = jwt.sign(
            {
              id: resPlayer.id,
              name: resPlayer.playerName,
              username: resPlayer.username,
              type: 'Player'
            },
            process.env.JWT_TOKEN_SECRET_KEY,
            { expiresIn: '30m' }
          );

          const addTokenToSession = await sessionPlayerTable.create({
            playerId: resPlayer.id,
            token: token,
            status: 'Y'
          });

          resolve(respConvert.successWithToken(token));
        } else {
          //if password wrong.
          return reject(respConvert.businessError(msgConstant.core.login_failed))
        }

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
            playerId: decoded.id,
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
          playerName: playerName,
          username: username,
          password: encryptedPassword,
          phoneNumber: phoneNumber,
          agentRefCode: agentRefCode,
          status: 'active'
        });

        // create player wallet on mongo
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await playerWalletCollec.insertOne({
          player_id: resCreatedPlayer.id,
          amount_coin: 0,
        })

        //update player wallet id
        const updatePlayerWallet = await playerTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { id: resCreatedPlayer.id }
          })

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
          id: userData.id
        },
        attributes: ['playerName'],
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
          id: userData.id
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
 * Player payment request from main page
 **/
exports.playerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { paymentType, wayToPay, amount, playerId, promotionId } = req.body

    if (paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq

        const requestCreate = await playerPaymentReqTable.create(
          {
            playerId: !playerId ? req.user.id : playerId,
            paymentType: paymentType,
            wayToPay: wayToPay,
            amount: amount,
            promotionRefId: !promotionId ? null : promotionId,
            paymentStatus: 'W',
            createBy: req.user.id,
            createDateTime: new Date(),
            createRoleType: req.user.type
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

      const paymentDetail = await playerPaymentReqTable.findOne({
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
 * List of player payment request in player page.
 **/
exports.listPlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {
      const playerPaymentReqTable = mysqlConnector.playerPaymentReq

      const paymentReqList = await playerPaymentReqTable.findAll({
        where: {
          player_id: req.user.id
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

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const playerCreatedByAgent = await playerTable.create({
          playerName: playerName,
          username: username,
          password: encryptedPassword,
          phoneNumber: phoneNumber,
          description: description,
          status: status,
          createBy: req.user.id,
          createDateTime: new Date(),
          updateBy: req.user.id,
          updateDateTime: new Date(),
        });


        // create player wallet on mongo
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await playerWalletCollec.insertOne({
          player_id: playerCreatedByAgent.id,
          amount_coin: 0,
        })

        //update player wallet id
        const updatePlayerWallet = await playerTable.update(
          {
            walletId: resCreatedWallet.insertedId.toString()
          },
          {
            where: { id: playerCreatedByAgent.id }
          })

        //(type, ref, desc, userId, createBy) 
        await utilLog.agentLog('register', null, 'player', playerCreatedByAgent.id, req.user.id)

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
 * returns PlayerModel
 **/
exports.listPlayerByAgentId = function (req) {
  return new Promise(function (resolve, reject) {

    const playerTable = mysqlConnector.player;
    const agentTable = mysqlConnector.agent;
    const employeeTable = mysqlConnector.employee;

    (async () => {


      const rtype = req.user.type;
      const user_id = req.user.id;

      let whereQry = {}

      if (rtype.toLowerCase() == 'agent') {
        console.log('agentagentagentagent')
        const agentInfo = await agentTable.findOne({
          where: {
            id: user_id
          },
          attributes: ['agentName', 'agentRefCode'],
          raw: true
        });

        console.log(agentInfo);

        whereQry = {
          agentRefCode: {
            [Op.eq]: agentInfo.agentRefCode
          }
        }
      } else if (rtype.toLowerCase() == 'employee') {
        console.log('employeeemployeeemployee')
        const employeeInfo = await employeeTable.findOne({
          where: {
            id: user_id
          },
          attributes: ['username', 'agentRefCode'],
          raw: true
        });

        whereQry = {
          agentRefCode: {
            [Op.eq]: employeeInfo.agentRefCode
          }
        }
      } else {
        console.log('other')
      }

      const playerList = await playerTable.findAll({
        where: whereQry,
        attributes: ['id', 'playerName', 'phoneNumber', 'username', 'ranking', 'status', 'walletId'],
        raw: true
      })

      const listOfPlayerWalletId = playerList.map((id) => ObjectId(id.walletId))

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
            id: player._id,
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

      playerPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });
      playerPaymentReqTable.belongsTo(playerTable, { foreignKey: 'playerId' });

      const rtype = req.user.type;
      const userId = req.user.id;

      const agentTable = mysqlConnector.agent
      const employeeTable = mysqlConnector.employee

      var arrayCreateId = [];
      if (rtype.toLowerCase() == 'agent') {
        const agentInfo = await agentTable.findOne({
          where: {
            id: userId
          },
          attributes: ['id', 'agentName', 'agentRefCode'],
          raw: true
        });
  
        const employeeInfo = await employeeTable.findAll({
          where: {
            agentRefCode: agentInfo.agentRefCode
          },
          attributes: ['id', 'username', 'agentRefCode'],
          raw: true
        });

        // console.log(agentInfo);
        // console.log(employeeInfo);
        arrayCreateId = stringUtils.pushCreateById(employeeInfo,agentInfo)
      }else{

        const employeeInfo = await employeeTable.findAll({
          where: {
            agentRefCode: req.user.agentRefCode
          },
          attributes: ['id', 'username', 'agentRefCode'],
          raw: true
        });

        const agentInfo = await agentTable.findOne({
          where: {
            agentRefCode: req.user.agentRefCode
          },
          attributes: ['id', 'agentName', 'agentRefCode'],
          raw: true
        });

        console.log(employeeInfo);
        console.log(agentInfo);

        arrayCreateId = stringUtils.pushCreateById(employeeInfo,agentInfo)
      }

      console.log(arrayCreateId);
      const paymentRequestList = await playerPaymentReqTable.findAll({
        where: {
          createBy: arrayCreateId
        },
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          },
          {
            model: playerTable,
            attributes: ['id', 'playerName'],
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

      const { playerId } = req.body

      const playerPaymentReqTable = mysqlConnector.playerPaymentReq
      const promotionTable = mysqlConnector.promotion

      playerPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestListOfPlayer = await playerPaymentReqTable.findAll({
        where: {
          playerId: playerId
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

    const { playerId } = req.body

    const playerTable = mysqlConnector.player;

    (async () => {
      const playerWalletId = await playerTable.findOne({
        where: {
          id: playerId
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

    const { playerId } = req.body

    const playerTable = mysqlConnector.player;

    (async () => {
      const playerInfo = await playerTable.findOne({
        where: {
          id: playerId
        },
        attributes: ['ranking', 'status', 'playerName'],
        raw: true
      })

      resolve(respConvert.successWithData(playerInfo, req.newTokenReturn))
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * Approve player payment request by Agent .
 **/
exports.approvePlayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const { id, paymentType, wayToPay, amount } = req.body

    console.log(req.body);

    if (id && paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq
        const playerTable = mysqlConnector.player

        //Find record for player id 
        const findUpdateRecordData = await playerPaymentReqTable.findOne({
          where: {
            id: id
          },
          attributes: ['playerId','createBy','createRoleType'],
          raw: true
        })

        //get player wallet id for update wallet
        const playerData = await playerTable.findOne({
          where: {
            id: findUpdateRecordData.playerId
          },
          attributes: ['walletId','username'],
          raw: true
        })

        //update status of payment request
        await playerPaymentReqTable.update(
          {
            approvedBy: req.user.id,
            approveDateTime: new Date(),
            paymentStatus: 'A'
          },
          {
            where: { id: id }
          }
        )

        //update player wallet
        const playerWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await playerWalletCollec.updateOne({
          _id: ObjectId(playerData.walletId)
        },
          { $inc: { amount_coin: paymentType == 'WD' ? -Math.abs(amount) : amount } }
        )

        //
        console.log(findUpdateRecordData)
        if(findUpdateRecordData.createRoleType.toLowerCase()=='employee'){
          const textDesc = 'Approved '+stringUtils.getPaymentTypeText(paymentType)+' '+playerData.username
          await utilLog.employeeLog(findUpdateRecordData.playerId, 'pay', id, textDesc, findUpdateRecordData.createBy) 
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
        const playerPaymentData = await playerPaymentReqTable.findOne({
          where: {
            id: id
          },
          attributes: ['playerId','createRoleType','createBy'],
          raw: true
        })

        //get player info
        const playerData = await playerTable.findOne({
          where: {
            id: playerPaymentData.playerId
          },
          attributes: ['username'],
          raw: true
        })

        console.log(playerPaymentData)
        if(playerPaymentData.createRoleType.toLowerCase()=='employee'){
          const textDesc = 'Disapproved ' + stringUtils.getPaymentTypeText(paymentType) + ' ' + playerData.username
          await utilLog.employeeLog(playerPaymentData.playerId, 'pay', id, textDesc, playerPaymentData.createBy)
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
