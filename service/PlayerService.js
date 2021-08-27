'use strict';
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../model/indexPlayer.js");



const { MongoClient } = require("mongodb");

const uri =
  "mongodb://root:example1234@157.245.205.111:27017/";


const client = new MongoClient(uri);



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
 * Logs user into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginPlayer = function (body) {
  return new Promise(function (resolve, reject) {

    console.log(body.username);

    if (body.username !== undefined && body.password !== undefined) {

      const Player = db.Player;
      const SessionPlayer = db.SessionPlayer;

      (async () => {


        const PlayerFindusername = await Player.findOne({
          where: {
            username: body.username,
            //password: body.password,
          }
        });

        console.log(PlayerFindusername);

        //if(PlayerFindusername)
        if (PlayerFindusername && await bcrypt.compare(body.password, PlayerFindusername.toJSON().password)) {

          const PlayerFindusernameJSON = PlayerFindusername.toJSON();

          const SessionPlayerFindid = await SessionPlayer.findOne({
            where: {
              playerId: PlayerFindusernameJSON.id,
            }
          });

          if (SessionPlayerFindid !== null) {

            reject({
              code: 500,
              message: 'Username นี้ ยังlogin อยู่'
            });

          }

          if (SessionPlayerFindid === null) {

            delete PlayerFindusernameJSON.password
            const token = jwt.sign(
              PlayerFindusernameJSON,
              'shhhhh'
            );
            // add token
            const addtoken = await SessionPlayer.create({
              playerId: PlayerFindusernameJSON.id,
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
exports.logoutPlayer = function (req) {
  return new Promise(function (resolve, reject) {


    if (req.user.id) {

      (async () => {



        const addtoken = await db.SessionPlayer.destroy({
          where: {
            playerId: req.user.id,
          }
        });

        resolve({
          deleted: true,
        });

      })();

    }



    reject({
      deleted: false,
    });


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
 * register Player
 *
 * body PlayerModel register new player witch agent refcode
 * no response value expected for this operation
 **/
exports.registerPlayer = function (body) {
  return new Promise(function (resolve, reject) {


    console.log(body);





    if (body.firstName !== undefined
      && body.lastName !== undefined
      && body.username !== undefined
      && body.password !== undefined
      && body.email !== undefined
      && body.phone !== undefined
      && body.refCodeAgent !== undefined
    ) {


      const Player = db.Player;


      (async () => {



        const oldUser = await Player.findOne({
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

        if (oldUser) {

          //console.log('ssssdasdasd');

          reject({
            code: 500,
            message: 'Username หรือ email ซ้ำ'
          });
        }

        //console.log('aaaaaa');


        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(body.password, 10);

        const PlayerCreate = await Player.create({
          firstname: body.firstName,
          lastname: body.lastName,
          username: body.username,
          password: encryptedPassword,
          email: body.email,
          refCodeAgent: body.refCodeAgent,
          userStatus: true,
        });

        console.log(PlayerCreate.toJSON());

        const PlayerCreateJSON = PlayerCreate.toJSON();

        delete PlayerCreateJSON.password

        // Create token
        // const token = jwt.sign(
        //   PlayerCreateJSON,
        //   'shhhhh'
        // );

        resolve(PlayerCreateJSON);



      })();


    } else {

      reject({
        code: 500,
        message: 'ข้อมูลไม่ครบ'
      });


    }







    //resolve();
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

