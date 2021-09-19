'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { ObjectID } = require('bson');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb");

/***************** Service by Plyer **************/

/**
 * Logs Player into the system
 **/
exports.loginPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { username, password } = body

    if (username && password) {

      (async () => {

        const playerTable = mysqlConnector.player
        const sessionPlayerTable = mysqlConnector.sessionPlayer

        const resPlayer = await playerTable.findOne({
          where: {
            username: username,
          },
          attributes: ['id', 'username', 'password', 'playerName'],
          raw: true
        });

        if (!resPlayer) return reject(respConvert.businessError(msgConstant.core.login_failed))

        if (resPlayer && await bcrypt.compare(password, resPlayer.password)) {

          const findSessionPlayer = await sessionPlayerTable.findOne({
            where: {
              playerId: resPlayer.id,
            }
          });

          if (findSessionPlayer) return reject(respConvert.businessError(msgConstant.core.already_login))

          const token = jwt.sign(
            {
              id: resPlayer.id,
              playerName: resPlayer.playerName,
              username: resPlayer.username,
              type: 'Player'
            },
            'TOKEN_SECRET_ad1703edd828154322f1543a43ccd4b3',
            { expiresIn: '8h' }
          );

          const addTokenToSession = await sessionPlayerTable.create({
            playerId: resPlayer.id,
            token: token,
          });

          resolve(respConvert.successLogin(token));

        } else {
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
 * Logged out player from system.
 * Also remove session (unfinished)
 **/
exports.logoutPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { token } = body

    if (token) {

      (async () => {
        const decoded = jwt.decode(token);

        if (decoded == null) return reject(respConvert.businessError(msgConstant.core.invalid_token));

        const sessionPlayerTable = mysqlConnector.sessionPlayer

        const removePlayerSession = await sessionPlayerTable.destroy({
          where: {
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
        attributes: ['playerName', 'walletId'],
        raw: true
      });

      const playerWalletCollec = mongoConnector.api.collection('player_wallet')

      const playerWalletAmount = await playerWalletCollec.findOne({
        _id: ObjectID(playerInfo.walletId)
      }, { projection: { _id: 0, amount_coin: 1 } })

      resolve(respConvert.successWithData({ playerName: playerInfo.playerName, amountCoin: playerWalletAmount.amount_coin }));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
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

      resolve(respConvert.successWithData(paymentReqList));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}



/***************** Service by XXXXXXXXX **************/