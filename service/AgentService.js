'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../model/indexAgent.js");


const dbPlayer = require("../model/indexPlayer.js");


/**
 * agent payment request
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.agentPaymentRequest = function (body, req) {
  console.log(req);
  return new Promise(function (resolve, reject) {

    (async () => {
      var paymentData = []
      paymentData.agent_id = '1'
      paymentData.amount = '1000'
      paymentData.status = '0'

      const paymentAgent = db.Payment;
      console.log('ggggfg');
      const paymentCreaterequse = await paymentAgent.create({
        user_id: '1',
        amount: '10000',
        type: '0',
        status: '0',
      })
      resolve({
        detail: paymentCreaterequse.toJSON()
      });
    })();
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
exports.approveplayerpayment = function (playerPaymentId) {
  console.log(playerPaymentId);
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
      console.log(paymentlist[0]);
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
exports.getagentById = function (paymentId) {
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
  console.log('dfdfdfdf');
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
      console.log(paymentlist);
      resolve(paymentlist);

    })();
  });
}


/**
 * List agent payment request
 *
 * no response value expected for this operation
 **/
exports.listagentPaymentRequest = function () {
  console.log("fdsfgggggg");
  console.log('listagentPaymentRequest');
  return new Promise(function (resolve, reject) {
    resolve();
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
  console.log("fdsfgggggg");
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
  console.log("listplayerPaymentRequestagent");
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
      console.log(paymentlist);
      resolve(paymentlist);

    })();
  });
}


/**
 * Logs user into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginagent = function (body) {
  return new Promise(function (resolve, reject) {

    console.log(body.username);

    if (body.username !== undefined && body.password !== undefined) {

      const Player = db.Agent;
      const SessionPlayer = db.SessionAgent;

      (async () => {


        const PlayerFindusername = await Player.findOne({
          where: {
            username: body.username,
            //password: body.password,
          }
        });

        console.log(body.password);
        console.log(PlayerFindusername.toJSON().password)
        const encryptedPassword = await bcrypt.hash(body.password, 10);
        const encryptedPassword2 = await bcrypt.hash(body.password, 10);
        console.log(encryptedPassword, encryptedPassword2);
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
exports.logoutagent = function () {
  return new Promise(function (resolve, reject) {
    resolve();
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
 * register Player
 *
 * body PlayerModel register new player witch agent refcode
 * no response value expected for this operation
 **/
exports.registerPlayer = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * register empoyee
 *
 * body PlayerModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.registerempoyee = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}


/**
 * Update player empoyee
 *
 * body PlayerModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.updateempoyeeDetail = function (body) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

