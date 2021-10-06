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
 * Logged in owner into the system
 **/
exports.loginOwner = function (body) {
  return new Promise(function (resolve, reject) {
    const { username, password } = body

    console.log(username, password)
    if (username && password && body !== 'undefined') {
      (async () => {

        const ownerTable = mysqlConnector.owner;
        //     const employeeTable = mysqlConnector.employee
        const sessionOwner = mysqlConnector.sessionOwner;
        //     const sessionEmployeeTable = mysqlConnector.sessionEmployee

        const resOwner = await ownerTable.findOne({
          where: {
            username: username,
          },
          attributes: ['id', 'username', 'password', 'displayName', 'firstname', 'lastname', 'userRefCode', 'rtype'],
          raw: true
        });

        console.log(resOwner)
        //     const resEmp = await employeeTable.findOne({
        //       where: {
        //         username: username,
        //       },
        //       attributes: ['id', 'username', 'password', 'firstname', 'lastname', 'agentRefCode'],
        //       raw: true
        //     });

        // if (resAgent === null && resEmp === null) {
        if (resOwner === null) {
          return reject(respConvert.businessError(msgConstant.core.login_failed))
        }

        // if username and password of Owner is true
        if (resOwner !== null) {
          if (await bcrypt.compare(password, resOwner.password)) {
            const findSessionOwner = await sessionOwner.findOne({
              where: {
                agentId: resOwner.id,
                status: 'Y'
              },
              raw: true
            });

            //if this Agent is already logged in system.
            if (findSessionOwner) {
              // update status of old session and token to 'N' that mean
              // this token is not valid now.
              const updateSessionStatus = sessionOwner.update({ status: "N" }, {
                where: {
                  id: findSessionOwner.id,
                  ownerId: findSessionOwner.ownerId
                }
              })
            }

            let token;
            if (resOwner) {
              token = jwt.sign(
                {
                  id: resOwner.id,
                  name: resOwner.agentName,
                  username: resOwner.username,
                  type: 'Agent',
                  agentRefCode: resOwner.agentRefCode
                },
                process.env.JWT_TOKEN_SECRET_KEY,
                { expiresIn: '30m' }
              );

              const addTokenToSession = await sessionOwner.create({
                agentId: resOwner.id,
                token: token,
                status: 'Y',
                createDateTime: new Date()
              });
            }

            resolve(respConvert.successWithToken(token));
          } else {
            return reject(respConvert.businessError(msgConstant.core.login_failed))
          }

        }


        //     // if username and password of Employee is true
        //     if (resEmp !== null) {
        //       if (await bcrypt.compare(password, resEmp.password)) {
        //         const findSessionEmployee = await sessionEmployeeTable.findOne({
        //           where: {
        //             employeeId: resEmp.id,
        //             status: 'Y'
        //           },
        //           raw: true
        //         });

        //         //if this Employee is already logged in system.
        //         if (findSessionEmployee) {
        //           // update status of old session and token to 'N' that mean
        //           // this token is not valid now.
        //           const updateSessionStatus = sessionEmployeeTable.update({ status: "N" }, {
        //             where: {
        //               id: findSessionEmployee.id,
        //               employeeId: findSessionEmployee.employeeId
        //             }
        //           })
        //         }

        //         let token;

        //         if (resEmp) {
        //           token = jwt.sign(
        //             {
        //               id: resEmp.id,
        //               username: resEmp.username,
        //               firstname: resEmp.firstname,
        //               lastname: resEmp.lastname,
        //               type: 'Employee',
        //               agentRefCode: resEmp.agentRefCode
        //             },
        //             process.env.JWT_TOKEN_SECRET_KEY,
        //             { expiresIn: '30m' }
        //           );

        //           const addTokenToSession = await sessionEmployeeTable.create({
        //             employeeId: resEmp.id,
        //             token: token,
        //             status: 'Y',
        //             createDateTime: new Date()
        //           });
        //         }

        //         resolve(respConvert.successWithToken(token));
        //       } else {
        //         return reject(respConvert.businessError(msgConstant.core.login_failed))
        //       }
        //     }
        resolve()
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
 * Logged out agent from system and session.
 **/
exports.logoutOwner = function (req) {
  return new Promise(function (resolve, reject) {

    const token = req.headers['authorization'].split(" ")[1];

    // if (token) {
    //   (async () => {

    //     const decoded = jwt.decode(token);

    //     if (decoded == null) return reject(respConvert.businessError(msgConstant.core.invalid_token));

    //     if (decoded.type == 'Agent') {
    //       const sessionAgentTable = mysqlConnector.sessionAgent
    //       const updateAgentSessionLogout = await sessionAgentTable.update({ status: 'N' }, {
    //         where: {
    //           agentId: decoded.id,
    //           token: token,
    //         }
    //       });
    //     } else {
    //       const sessionEmployeeTable = mysqlConnector.sessionEmployee
    //       const updateEmployeeSessionLogout = await sessionEmployeeTable.update({ status: 'N' }, {
    //         where: {
    //           employeeId: decoded.id,
    //           token: token,
    //         }
    //       });
    //     }

    //     resolve(respConvert.success());

    //   })().catch(function (err) {
    //     console.log('[error on catch] : ' + err)
    //     reject(respConvert.systemError(err.message))
    //   })
    // } else {
    //   reject(respConvert.businessError(msgConstant.core.invalid_token));
    // }

  });
}


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
              },
              {
                agentRefCode: agentRefCode
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

      resolve(respConvert.successWithData(paymentRequestList));

    })().catch(function (err) {
      console.log('[error on catch] : ' + err)
      reject(respConvert.systemError(err.message))
    })

  });
}



/**
 * Owner Register for testing purpose only
 **/
exports.ownerRegister = function (body) {
  return new Promise(function (resolve, reject) {

    const { ownerName, email, phoneNumber, username, password, description, status } = body

    if (ownerName && email && phoneNumber && username && password && description || description == "" && status) {

      (async () => {
        const ownerTable = mysqlConnector.owner

        const checkDuplucatedUsername = await ownerTable.findOne({
          where: {
            [Op.or]: [
              {
                ownerName: ownerName,
              },
              {
                username: username
              },
            ]
          }
        });

        //if not duplicate this will be 'null' value
        if (checkDuplucatedUsername) {
          return reject(respConvert.businessError(msgConstant.owner.duplicate_user))
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const resCreateOwner = await ownerTable.create({
          ownerName: ownerName,
          username: username,
          password: encryptedPassword,
          email: email,
          phoneNumber: phoneNumber,
          description: description,
          status: status,
          createBy: 1,
          createDateTime: new Date(),
          updateBy: 1,
          updateDateTime: new Date(),
        });

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