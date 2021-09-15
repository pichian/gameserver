'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const mysqlConnector = require("../connector/mysqlConnector")
const mongoConnector = require("../connector/mongodb")

/**
 * Finds wallet player by token key
 * Finds wallet player detail by token key.
 *
 * returns List
 **/
exports.findById = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      await client.connect();

      const database = client.db("player");
      const haiku = database.collection("wallet");

      const wallet = await haiku.findOne(
        { user_id: 1 },
      );
      console.log(wallet);
      resolve(wallet);

      // var examples = {};
      // examples['application/json'] = [{
      //   "amountCoin": 6.027456183070403,
      //   "coinList": [{
      //     "key": ""
      //   }, {
      //     "key": ""
      //   }],
      //   "userid": 0
      // }, {
      //   "amountCoin": 6.027456183070403,
      //   "coinList": [{
      //     "key": ""
      //   }, {
      //     "key": ""
      //   }],
      //   "userid": 0
      // }];
      // if (Object.keys(examples).length > 0) {
      //   resolve(examples[Object.keys(examples)[0]]);
      // } else {
      //   resolve();
      // }

    })();


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
  console.log("ggggg");
  return new Promise(function (resolve, reject) {

    const payment = db.Payment;
    (async () => {
      const paymentlist = await payment.findOne({
        where: {
          id: {
            [Op.eq]: paymentId,
          },
        }
      });
      console.log(paymentlist);
      resolve(paymentlist);

    })();

    // var examples = {};
    // examples['application/json'] = {
    //   "Status": "Status",
    //   "agentId": 9,
    //   "Amount": 1.4658129805029452,
    //   "id": 0
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * List agent payment request
 *
 * returns PaymentModel
 **/
exports.listplayerPaymentRequest = function (req) {
  return new Promise(function (resolve, reject) {

    const payment = db.Payment;
    (async () => {
      const paymentlist = await payment.findAll({
        where: {
          // user_id: {
          //   [Op.eq]: 1
          // },
          // status: {
          //   [Op.eq]: 1
          // }
        }
      });
      console.log(paymentlist);
      resolve(paymentlist);

    })();

    // var examples = {};
    // examples['application/json'] = {
    //   "Status": "Status",
    //   "agentId": 11,
    //   "Amount": 1.4658129805029452,
    //   "id": 0
    // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}


/**
 * Logs Player into the system
 **/
exports.loginPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { username, password } = body

    if (username && password) {

      (async () => {

        const playerTable = mysqlConnector.Player
        const sessionPlayerTable = mysqlConnector.sessionPlayer

        const resPlayer = await playerTable.findOne({
          where: {
            username: username,
          },
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
              playerName: resPlayer.playerName,
              username: resPlayer.username
            },
            'TOKEN_SECRET_ad1703edd828154322f1543a43ccd4b3'
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
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
}


/**
 * Logs out current logged in user session
 *
 * no response value expected for this operation
 **/
exports.logoutPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { token } = body

    if (token) {

      (async () => {

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
      reject(respConvert.validateError(msgConstant.core.invalid_token));
    }

  });
}


/**
 * agent payment request
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.playerPaymentRequest = function (body) {
  console.log('gggg');
  return new Promise(function (resolve, reject) {
    (async () => {

      const input = {
        //type: '0',
      };

      if (body.id !== undefined) {
        input.id = body.id;
      }
      if (body.amount !== undefined) {
        input.amount = body.amount;
      }
      if (body.agentId !== undefined) {
        input.user_id = body.agentId;
      }
      if (body.status !== undefined) {
        //input.Status = body.Status;
        input.status = body.status;
      }
      if (body.type !== undefined) {
        //input.Status = body.Status;
        input.status = body.type;
      }



      const payment = db.Payment;
      console.log('ggggfg');
      const paymentCreaterequse = await payment.create(
        {
          // user_id: '1',
          // amount: '10000',
          // type: '0',
          // status: '0',
          ...input,
        }
      )
      resolve({
        detail: paymentCreaterequse.toJSON()
      });
    })();

  });
}


/**
 * Register player from main page.
 **/
exports.registerPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    const { playerName, username, password, phoneNumber, agentRefCode } = body;

    if (!(playerName && username && password && phoneNumber && agentRefCode)) {

      (async () => {

        const playerTable = mysqlConnector.Player

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
        const agentWalletCollec = mongoConnector.api.collection('player_wallet')
        const resCreatedWallet = await agentWalletCollec.insertOne({
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
 * Update player detail
 *
 * body PlayerPutInput update Player Detail
 * no response value expected for this operation
 **/
exports.updatePlayerDetail = function (req, body) {
  return new Promise(function (resolve, reject) {



    if (req.user.id && body !== undefined) {




      try {

        console.log('req.user.id=' + req.user.id);


        (async () => {



          const input = {};

          if (body.firstname !== undefined) {
            input.firstname = body.firstname;
          }
          if (body.lastname !== undefined) {
            input.lastname = body.lastname;
          }
          if (body.email !== undefined) {
            input.email = body.email;
          }
          if (body.password !== undefined) {
            const encryptedPassword = await bcrypt.hash(body.password, 10);
            input.password = encryptedPassword;
          }
          if (body.phone !== undefined) {
            input.phone = body.phone;
          }
          if (body.userStatus !== undefined) {
            input.userStatus = body.userStatus;
          }
          if (body.refCodeAgent !== undefined) {
            input.refCodeAgent = body.refCodeAgent;
          }

          console.log(input);

          const Player = db.Player;

          if (Object.keys(input).length > 0) {





            const result = await Player.update(
              {
                ...input,
              },
              {
                where: {
                  id: {
                    [Op.eq]: req.user.id,
                  },
                },
              }
            );


          }

          const NewPlayerUpdate = await Player.findOne({
            where: {
              id: req.user.id,
              //password: body.password,
            }
          });


          const NewPlayerUpdateJSON = NewPlayerUpdate.toJSON();
          delete NewPlayerUpdateJSON.password;

          console.log(NewPlayerUpdateJSON);

          resolve(NewPlayerUpdateJSON);

        })();


      } catch (error) {

        throw Error('ทำรายการไม่สำเร็จ');
        reject({
          code: 500,
          message: 'ทำรายการไม่สำเร็จ'
        });


      }



    } else {

      //throw Error('ทำรายการไม่สำเร็จ');
      reject({
        code: 500,
        message: 'ทำรายการไม่สำเร็จ'
      });

    }

  });
}

