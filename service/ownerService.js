'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



// const dbPlayer = require("../model/indexPlayer.js");
// const dbOwner = require("../model/indexOwner.js");
// const dbAgent = require("../model/indexAgent.js");


const { MongoClient } = require("mongodb");

const uri =
  "mongodb://root:example1234@157.245.205.111:27017/";


const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("agent");
    const haiku = database.collection("wallet");
    //dddddddddddcreate a document to insert
    const doc = {
      agent_id: 1,
      amount_coin: 0,
      coin_list: {
        coinlotto: {
          name: "LottoRich",
          amount: 0,
        }
      }
    }
    const result = await haiku.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);


  } finally {
    await client.close();
  }
}
async function updatewalletagent(cb, data) {
  await client.connect();
  console.log(data.toJSON().amount);
  var newvalues
  if (data.toJSON().type === 1) {
    newvalues = { $inc: { amount_coin: -parseInt(data.toJSON().amount) } };

  } else {
    newvalues = { $inc: { amount_coin: +parseInt(data.toJSON().amount) } };

  }
  const database = client.db("agent");
  const haiku = database.collection("wallet");
  var myquery = { agent_id: data.toJSON().user_id };

  haiku.updateOne(myquery, newvalues, function (err, res) {
    if (err) throw err;
    console.log("1 document updated");
    client.close();
    cb()
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

