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



/**
 * owner register Agent (log system unfinished)
 *
 **/
exports.ownerAgentRegister = function (body) {
  return new Promise(function (resolve, reject) {

    const { agentName, email, phoneNumber, username, password, description, status, agentRefCode } = body

    if (agentName && email && phoneNumber && username && password && description || description == "" && status && agentRefCode) {

      (async () => {
        const agentTable = mysqlConnector.agent

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
 * Listagent by owner id.
 *
 **/
exports.listAgentByOwnerId = function (req) {
  return new Promise(function (resolve, reject) {

    const agentTable = mysqlConnector.agent;

    (async () => {
      const agentList = await agentTable.findAll({
        // where: {
        //   createBy: {
        //     [Op.eq]: req.user.id
        //   }
        // },
        attributes: ['id', 'agentName', 'phoneNumber', 'email', 'username', 'ranking', 'status', 'walletId'],
        raw: true
      })

      const listOfAgentWalletId = agentList.map((id) => ObjectId(id.walletId))

      const agentWalletCollec = mongoConnector.api.collection('agent_wallet')
      const resultOfAgentWalletAmount = await agentWalletCollec.aggregate([
        {
          $match: {
            _id: { $in: listOfAgentWalletId }

          }
        },
      ]).toArray()

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
            id: agent._id,
            playerName: agent.agentName,
            email: agent.email,
            phoneNumber: agent.phoneNumber,
            username: agent.username,
            ranking: agent.ranking,
            status: agent.status,
            walletId: agent.walletId
          })
      })

      resolve(respConvert.successWithData(returnDataMatchedCredit))

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(new Error(err.message));
    })

  });
}


/**
 * List agent payment request.
 *
 **/
exports.listAgentPaymentRequestAll = function (req) {
  return new Promise(function (resolve, reject) {
    (async () => {

      const agentPaymentReqTable = mysqlConnector.agentPaymentReq
      const promotionTable = mysqlConnector.promotion
      const agentTable = mysqlConnector.agent

      agentPaymentReqTable.belongsTo(promotionTable, { foreignKey: 'promotionRefId' });
      agentPaymentReqTable.belongsTo(agentTable, { foreignKey: 'agentId' });

      const paymentRequestList = await agentPaymentReqTable.findAll({
        attributes: ['id', 'paymentType', 'wayToPay', 'amount', 'paymentStatus'],
        include: [
          {
            model: promotionTable,
            attributes: ['promotionName'],
          },
          {
            model: agentTable,
            attributes: ['id', 'agentName'],
          }
        ],
        raw: true,
        nest: true
      })

      console.log(paymentRequestList)
      resolve(respConvert.successWithData(paymentRequestList));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}



//console.log(process.env)
/**
 * agent payment request
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.agentPaymentRequest = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
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
 * payment agent detail
 * Returns a single pet
 *
 * agentPaymentId Long ID of pet to return
 * returns PlayerModel
 **/
exports.approveagentpayment = function (agentPaymentId) {

  return new Promise(function (resolve, reject) {
    (async () => {

      const payment = dbAgent.Payment;
      const paymentlist = await payment.findAll({
        where: {
          id: {
            [Op.eq]: agentPaymentId
          }
        }
      });



      const paymentupdate = await payment.update({ status: 1 }, {
        where: {
          id: {
            [Op.eq]: agentPaymentId
          }
        }
      })


      //console.log(paymentlist);

      if (paymentupdate[0] === 1) {
        updatewalletagent(() => { resolve({ "detail": "ok" }) }, paymentlist[0]);
        //run().catch(console.dir,resolve({"detail" : "ok"}));
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
exports.getagentById = function (paymentId) {
  return new Promise(function (resolve, reject) {
    const payment = dbAgent.Payment;
    (async () => {
      const paymentlist = await payment.findOne({
        where: {
          id: {
            [Op.eq]: paymentId
          }
        }
      });
      console.log(paymentlist);
      resolve(paymentlist);

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
exports.listagentPaymentRequest = function () {
  return new Promise(function (resolve, reject) {
    const payment = dbAgent.Payment;
    (async () => {
      const paymentlist = await payment.findAll({
        where: {
          user_id: {
            [Op.eq]: 1
          }
        }
      });
      console.log(paymentlist);
      resolve(paymentlist);

    })();
  });
}

/**
 * List Player
 *
 * returns PlayerModel
 **/
exports.listPlayer = function () {
  console.log("fdsfgggggg");
  return new Promise(function (resolve, reject) {

    const player = dbPlayer.Player;
    (async () => {
      const playerlist = await player.findAll({
        // where: {
        //   id: {
        //     [Op.eq]: paymentId
        //   }
        // }
      });
      //console.log(playerlist);
      resolve(playerlist);

    })();

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
 * Logs user into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginowner = function (body) {
  return new Promise(function (resolve, reject) {

    console.log(body.username);

    if (body.username !== undefined && body.password !== undefined) {

      const Player = dbOwner.Owner;
      const SessionPlayer = dbOwner.SessionOwner;

      (async () => {


        const PlayerFindusername = await Player.findOne({
          where: {
            username: body.username,
            //password: body.password,
          }
        });

        console.log(body.password);

        //if(PlayerFindusername)
        //console.log(await bcrypt.compare(body.password, PlayerFindusername.toJSON().password));

        if (PlayerFindusername && await bcrypt.compare(body.password, PlayerFindusername.toJSON().password)) {

          const PlayerFindusernameJSON = PlayerFindusername.toJSON();

          const SessionPlayerFindid = await SessionPlayer.findOne({
            where: {
              OwnerId: PlayerFindusernameJSON.id,
            }
          });

          if (SessionPlayerFindid !== null) {

            delete PlayerFindusernameJSON.password
            const token = jwt.sign(
              PlayerFindusernameJSON,
              'shhhhh'
            );
            // add token

            const addtoken = await SessionPlayer.update(
              {
                token: token,
              },
              {
                where: {
                  OwnerId: PlayerFindusernameJSON.id
                },
              }
            );

            if (addtoken[0] == 1) {
              resolve({
                token: token,
              });
            } else {
              reject({
                code: 500,
                message: 'can not update token !!!'
              });
            }



          }

          if (SessionPlayerFindid === null) {

            delete PlayerFindusernameJSON.password
            const token = jwt.sign(
              PlayerFindusernameJSON,
              'shhhhh'
            );
            // add token
            const addtoken = await SessionPlayer.create({
              OwnerId: PlayerFindusernameJSON.id,
              token: token,
            });

            resolve({
              token: addtoken.toJSON().token,
            });

          }


        } else {

          reject({
            code: 500,
            message: 'Username ไม่ถูกต้อง'
          });

        }


      })();


      // var examples = {};
      // examples['application/json'] = {
      //   "token": "token"
      // };
      // if (Object.keys(examples).length > 0) {
      //   resolve(examples[Object.keys(examples)[0]]);
      // } else {
      //   resolve();
      // }


    } else {

      reject({
        code: 500,
        message: 'Username ไม่ถูกต้อง'
      });

      //throw new Error('username and password not found')

    }



  });
}


/**
 * Logs out current logged in user session
 *
 * no response value expected for this operation
 **/
exports.logoutowner = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

exports.createagent = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

