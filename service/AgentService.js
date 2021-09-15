'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dbConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");

/****
 * agent payment request edit file name
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.agentPaymentRequest = function (body, req) {
  return new Promise(function (resolve, reject) {
    (async () => {
      var paymentData = []
      paymentData.agent_id = '1'
      paymentData.amount = '1000'
      paymentData.status = '0'

      const paymentAgent = db.Payment;
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
 * List Player
 *
 * returns PlayerModel
 **/
exports.listPlayerByAgentId = function () {
  return new Promise(function (resolve, reject) {

    const playerTable = dbPlayerConnector.Player;

    (async () => {
      const playerList = await playerTable.findAll({
        // where: {
        //   id: {
        //     [Op.eq]: 1
        //   }
        // },
        attributes: ['id', 'playerName', 'credit', 'status'],
        raw: true
      })
      resolve(respConvert.successWithData(playerList))
    })().catch(function (err) {
      reject(new Error(err.message));
    })

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
 * Logs user into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginAgent = function (body) {
  return new Promise(function (resolve, reject) {
    if (body.username !== undefined || body.username !== '' && body.password !== undefined || body.password !== '') {
      const agentTable = dbAgent.Agent;
      const sessionAgentTable = dbSessionAgent.SessionAgent;
      (async () => {
        // const PlayerFindusername = await Player.findOne({
        //   where: {
        //     username: body.username,
        //     //password: body.password,
        //   }
        // });
        // console.log(body.password);
        // console.log(PlayerFindusername.toJSON().password)
        // const encryptedPassword = await bcrypt.hash(body.password, 10);
        // const encryptedPassword2 = await bcrypt.hash(body.password, 10);
        // console.log(encryptedPassword, encryptedPassword2);
        // //if(PlayerFindusername)
        // //console.log(await bcrypt.compare(body.password, PlayerFindusername.toJSON().password));

        // if (PlayerFindusername && await bcrypt.compare(body.password, PlayerFindusername.toJSON().password)) {

        //   const PlayerFindusernameJSON = PlayerFindusername.toJSON();

        //   const SessionPlayerFindid = await SessionPlayer.findOne({
        //     where: {
        //       OwnerId: PlayerFindusernameJSON.id,
        //     }
        //   });

        //   if (SessionPlayerFindid !== null) {

        //     delete PlayerFindusernameJSON.password
        //     const token = jwt.sign(
        //       PlayerFindusernameJSON,
        //       'shhhhh'
        //     );
        //     // add token

        //     const addtoken = await SessionPlayer.update(
        //       {
        //         token: token,
        //       },
        //       {
        //         where: {
        //           OwnerId: PlayerFindusernameJSON.id
        //         },
        //       }
        //     );

        //     if (addtoken[0] == 1) {
        //       resolve({
        //         token: token,
        //       });
        //     } else {
        //       reject({
        //         code: 500,
        //         message: 'can not update token !!!'
        //       });
        //     }



        //   }

        //   if (SessionPlayerFindid === null) {

        //     delete PlayerFindusernameJSON.password
        //     const token = jwt.sign(
        //       PlayerFindusernameJSON,
        //       'shhhhh'
        //     );
        //     // add token
        //     const addtoken = await SessionPlayer.create({
        //       OwnerId: PlayerFindusernameJSON.id,
        //       token: token,
        //     });

        //     resolve({
        //       token: addtoken.toJSON().token,
        //     });

        //   }


        // } else {

        //   reject({
        //     code: 400,
        //     message: 'Username ไม่ถูกต้อง'
        //   });

        // }


      })();
    } else {
      reject({
        code: 403,
        message: ' Invalid Username or Password'
      });
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
exports.logoutAgent = function () {
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
exports.agentPlayerRegister = function (body) {
  return new Promise(function (resolve, reject) {
    if (body.playerName !== undefined
      && body.username !== undefined
      && body.password !== undefined
      && body.email !== undefined
      && body.description !== undefined
      // && body.refCode !== undefined
      && body.status !== undefined
    ) {
      (async () => {
        const playerTable = dbPlayerConnector.Player

        const checkDuplucatedUsername = await playerTable.findOne({
          where: {
            [Op.or]: [
              {
                email: body.email,
              },
              {
                username: body.username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          reject(respConvert.businessError(msgConstant.agent.duplicate_user))
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(body.password, 10);

        const playerCreate = await playerTable.create({
          playerName: body.playerName,
          username: body.username,
          password: encryptedPassword,
          email: body.email,
          description: body.description,
          status: body.status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });
        resolve(respConvert.success());
      })().catch(function (err) {
        reject(new Error(err.message));
      })

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }
  });
}











/**
 * register empoyee
 *
 * body PlayerModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.agentEmployeeRegister = function (body) {
  return new Promise(function (resolve, reject) {
    if (body.employeeName !== undefined
      && body.username !== undefined
      && body.password !== undefined
      && body.email !== undefined
      && body.description !== undefined
      && body.status !== undefined
    ) {
      (async () => {
        const employeeTable = dbEmployeeConnector.Employee

        const checkDuplucatedUsername = await employeeTable.findOne({
          where: {
            [Op.or]: [
              {
                email: body.email,
              },
              {
                username: body.username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          reject(respConvert.businessError(msgConstant.agent.duplicate_user))
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(body.password, 10);

        const employeeCreate = await employeeTable.create({
          employeeName: body.employeeName,
          username: body.username,
          password: encryptedPassword,
          email: body.email,
          description: body.description,
          status: body.status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });
        resolve(respConvert.success());
      })().catch(function (err) {
        reject(new Error(err.message));
      })
    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
}


/**
 * List employee
 *
 * no response value expected for this operation
 **/
exports.listEmployeeByAgentId = function () {
  return new Promise(function (resolve, reject) {

    const employeeTable = dbEmployeeConnector.Employee;

    (async () => {
      const employeeList = await employeeTable.findAll({
        // where: {
        //   id: {
        //     [Op.eq]: 1
        //   }
        // },
        attributes: ['id', 'username', 'status'],
        raw: true
      })
      resolve(respConvert.successWithData(employeeList))
    })().catch(function (err) {
      reject(new Error(err.message));
    })

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


/**
 * register empoyee
 *
 * body PlayerModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.promotionCreate = function (body) {
  return new Promise(function (resolve, reject) {
    if (
      body.promotionName !== undefined &&
      body.promotionType !== undefined &&
      body.rateType !== undefined &&
      body.rateAmount !== undefined &&
      body.dateStart !== undefined &&
      body.dateStop !== undefined &&
      body.description !== undefined &&
      body.status !== undefined
    ) {
      (async () => {
        const promotionTable = dbPromotionConnector.Promotion

        await promotionTable.create({
          promotionName: body.promotionName,
          promotionType: body.promotionType,
          rateType: body.rateType,
          rateAmount: body.rateAmount,
          dateStart: body.dateStart,
          dateStop: body.dateStop,
          status: body.status,
          description: body.description,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });

        resolve(respConvert.success());

      })().catch(function (err) {
        reject(new Error(err.message));
      })
    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }
  });
}


/**
 * List Player
 *
 * returns PlayerModel
 **/
exports.listPromotionByAgentId = function () {
  return new Promise(function (resolve, reject) {

    const promotionTable = dbPromotionConnector.Promotion;

    (async () => {
      const promotionList = await promotionTable.findAll({
        // where: {
        //   id: {
        //     [Op.eq]: 1
        //   }
        // },
        attributes: ['id', 'date_start', 'date_stop', 'promotion_name', 'promotion_type', 'rate_type', 'rate_amount'],
        raw: true
      })
      resolve(respConvert.successWithData(promotionList))
    })().catch(function (err) {
      reject(new Error(err.message));
    })

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
    if (body.name
      && body.username !== undefined
      && body.password !== undefined
      && body.email !== undefined
      && body.description !== undefined
      && body.refCode !== undefined
      && body.status !== undefined
    ) {
      (async () => {
        const agentTable = dbAgentConnector.Agent

        const checkDuplucatedUsername = await agentTable.findOne({
          where: {
            [Op.or]: [
              {
                email: body.email,
              },
              {
                username: body.username
              }
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          reject(respConvert.businessError(msgConstant.agent.duplicate_user))
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(body.password, 10);

        const agentCreate = await agentTable.create({
          name: body.name,
          username: body.username,
          password: encryptedPassword,
          email: body.email,
          description: body.description,
          refCode: body.refCode,
          status: body.status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });

        resolve(respConvert.success());

      })().catch(function (err) {
        reject(new Error(err.message));
      })

    } else {
      reject(respConvert.validateError(msgConstant.core.validate_error));
    }

  });
}