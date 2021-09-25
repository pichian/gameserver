'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { ObjectID } = require('bson');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb");
const utilLog = require("../utils/log")

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
exports.registerPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { playerName, username, password, phoneNumber, agentRefCode } = body;

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
        _id: ObjectID(playerInfo.walletId)
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

    const { paymentType, wayToPay, amount } = req.body

    if (paymentType && wayToPay && amount) {

      (async () => {

        const playerPaymentReqTable = mysqlConnector.playerPaymentReq

        const requestCreate = await playerPaymentReqTable.create(
          {
            playerId: req.user.id,
            paymentType: paymentType,
            wayToPay: wayToPay,
            amount: amount,
            paymentStatus: 'W',
            createDateTime: new Date()
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
 * List of player payment request.
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

    (async () => {
      const playerList = await playerTable.findAll({
        where: {
          createBy: {
            [Op.eq]: req.user.id
          }
        },
        attributes: ['id', 'playerName', 'phoneNumber', 'username', 'ranking', 'status'],
        raw: true
      })

      resolve(respConvert.successWithData(playerList, req.newTokenReturn))
    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}

/**
 * List player payment request by Agent.
 * This table is in Agent page.
 **/
exports.listplayerPaymentRequestByAgent = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const playerPaymentReqTable = mysqlConnector.playerPaymentReq
      const promotionTable = mysqlConnector.promotion
      playerPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });

      const paymentRequestList = await playerPaymentReqTable.findAll({
        // where: {
        //   createBy: req.user.id
        // },
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

/**
 * Agent get Player wallet amount by Player Id.
 **/
exports.findPlayerWalletById = function (req) {
  return new Promise(function (resolve, reject) {

    const { playerId } = req.body

    console.log('playerId ' + playerId)

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
        _id: ObjectID(playerWalletId.wallet_id)
      }, { projection: { _id: 0, amount_coin: 1 } })

      console.log(playerWalletAmount)

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
          createBy: {
            [Op.eq]: req.user.id
          }
        },
        attributes: ['ranking', 'status'],
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
