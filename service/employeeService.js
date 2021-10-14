const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const utilLog = require("../utils/log")
const strUtil = require("../utils/String")
const commUtil = require("../utils/common")

/**
 * Register Employee
 **/
exports.agentEmployeeRegister = function (req) {
    return new Promise(function (resolve, reject) {

        const { title, firstname, lastname, email, phoneNumber, username, password, description, workBeginDate, status } = req.body

        if (title && firstname && lastname && email || email == '' && phoneNumber || phoneNumber == '' && username && password && description || description == '' && workBeginDate && status) {
            (async () => {
                const employeeTable = mysqlConnector.employee
                const sequenceNow = await commUtil.getRefCodeSequence()

                const checkDuplucatedUsername = await employeeTable.findOne({
                    where: {
                        [Op.or]: [
                            {
                                email: email,
                            },
                            {
                                username: username
                            }
                        ]
                    }
                });

                //if not duplicate this will be 'null' value
                if (checkDuplucatedUsername) return reject(respConvert.businessError(msgConstant.employee.duplicate_employee))

                //Encrypt user password
                const encryptedPassword = await bcrypt.hash(password, 10);

                const employeeCreated = await employeeTable.create({
                    employeeRefCode: 'emp' + strUtil.paddingNumberWithDate(sequenceNow, 5),
                    agentRefCode: req.user.userRefCode,
                    title: title,
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: encryptedPassword,
                    email: email,
                    phoneNumber: phoneNumber,
                    description: description,
                    workBeginDate: workBeginDate,
                    status: status,
                    createRoleType: req.user.type,
                    createBy: req.user.userRefCode,
                    createDateTime: new Date(),
                    updateBy: req.user.userRefCode,
                    updateDateTime: new Date(),
                });

                //update sequence
                await commUtil.updateRefCodeSequence()

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('register', null, 'employee', employeeCreated.id, req.user.userRefCode)

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
 * List employee bya agent id.
 **/
exports.listEmployeeByAgentId = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const employeeTable = mysqlConnector.employee;

            const employeeList = await employeeTable.findAll({
                where: {
                    createBy: {
                        [Op.eq]: req.user.userRefCode
                    }
                },
                attributes: ['employeeRefCode', 'title', 'firstname', 'lastname', 'phoneNumber', 'email', 'username', 'status'],
                raw: true
            })
            resolve(respConvert.successWithData(employeeList, req.newTokenReturn))
        })().catch(function (err) {
            reject(respConvert.systemError(err.message))
        })

    });
}


/**
 * Get single employee detail.
 **/
exports.getEmployeeDetail = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const { employeeRefCode } = req.body
            const employeeTable = mysqlConnector.employee;
            const employeeLogTable = mysqlConnector.employeeLog

            const employeeInfo = await employeeTable.findOne({
                where: {
                    employeeRefCode: employeeRefCode
                },
                attributes: ['employeeRefCode', 'title', 'firstname', 'lastname', 'phoneNumber', 'workBeginDate', 'status'],
                raw: true
            })


            //find total player credit by agent
            const listEmployeeLogs = await employeeLogTable.findAll({
                where: {
                    createBy: employeeRefCode
                },
                attributes: ['id', 'description', 'createDateTime'],
                order: [['createDateTime', 'DESC']],
                raw: true
            })

            employeeInfo.employeeLogs = setEmployeeLogs(listEmployeeLogs)

            resolve(respConvert.successWithData(employeeInfo, req.newTokenReturn))

        })().catch(function (err) {
            console.log('[error on catchss] : ' + err)
            reject(respConvert.systemError(err.message))
        })
    });
}

/**
 * Get employee info when employee login.
 **/
exports.getEmployeeInfo = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const employeeTable = mysqlConnector.employee;
            const employeeLogTable = mysqlConnector.employeeLog

            const employeeInfo = await employeeTable.findOne({
                where: {
                    employeeRefCode: req.user.userRefCode
                },
                attributes: ['employeeRefCode', 'title', 'firstname', 'lastname', 'phoneNumber', 'workBeginDate'],
                raw: true
            })

            //find employee log
            const listEmployeeLogs = await employeeLogTable.findAll({
                where: {
                    createBy: req.user.userRefCode
                },
                attributes: ['id', 'description', 'createDateTime'],
                raw: true
            })

            employeeInfo.employeeLogs = setEmployeeLogs(listEmployeeLogs)

            resolve(respConvert.successWithData(employeeInfo, req.newTokenReturn))

        })().catch(function (err) {
            reject(respConvert.systemError(err.message))
        })
    });
}

/**
 * Ban employee by agent.
 **/
exports.banEmployee = function (req) {
    return new Promise(function (resolve, reject) {

        const { employeeRefCode } = req.body

        if (employeeRefCode) {

            (async () => {

                const employeeTable = mysqlConnector.employee
                const sessionEmployee = mysqlConnector.sessionEmployee

                await employeeTable.update(
                    {
                        status: 'banned'
                    },
                    {
                        where: { employeeRefCode: employeeRefCode }
                    }
                )

                await sessionEmployee.update({ status: 'N' }, { where: { employeeCode: employeeRefCode } })

                if (req.user.type != 'Owner' || req.user.type !== 'Manager') {
                    //(type, ref, desc, userId, createBy) 
                    await utilLog.agentLog('ban', null, 'employee', employeeRefCode, req.user.userRefCode)
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
 * Un Ban employee by agent.
 **/
exports.unBanEmployee = function (req) {
    return new Promise(function (resolve, reject) {

        const { employeeRefCode } = req.body

        if (employeeRefCode) {
            (async () => {
                const employeeTable = mysqlConnector.employee

                await employeeTable.update(
                    {
                        status: 'active'
                    },
                    {
                        where: { employeeRefCode: employeeRefCode }
                    }
                )

                if (req.user.type != 'Owner' || req.user.type !== 'Manager') {
                    //(type, ref, desc, userId, createBy) 
                    await utilLog.agentLog('ban', null, 'employee', employeeRefCode, req.user.userRefCode)
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
 * Change employee password by Agent.
 **/
exports.resetEmployeePassword = function (req) {
    return new Promise(function (resolve, reject) {

        const { employeeRefCode, newPassword } = req.body

        if (employeeRefCode && newPassword) {

            (async () => {

                const employeeTable = mysqlConnector.employee

                //Encrypt user password
                const encryptedPassword = await bcrypt.hash(newPassword, 10);

                await employeeTable.update(
                    {
                        password: encryptedPassword
                    },
                    {
                        where: { employeeRefCode: employeeRefCode }
                    }
                )

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('changePassword', null, 'employee', employeeRefCode, req.user.userRefCode)

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
 * List employee for owner.
 **/
exports.listEmployee = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const employeeTable = mysqlConnector.employee;

            const employeeList = await employeeTable.findAll({
                // where: {
                //     createBy: {
                //         [Op.eq]: req.user.userRefCode
                //     }
                // },
                attributes: ['employeeRefCode', 'title', 'firstname', 'lastname', 'phoneNumber', 'email', 'username', 'status'],
                raw: true
            })
            resolve(respConvert.successWithData(employeeList, req.newTokenReturn))
        })().catch(function (err) {
            reject(respConvert.systemError(err.message))
        })

    });
}



function setEmployeeLogs(listEmployeeLogs) {
    //find employee logs
    let employeeLogs = []
    if (listEmployeeLogs.length > 0) {
        listEmployeeLogs.forEach(element => {
            let logObj = {}
            logObj._id = element.id;
            logObj.dateTime = element.createDateTime;
            logObj.action = element.description;
            employeeLogs.push(logObj)
        });
    }
    return employeeLogs;
}