const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");
const utilLog = require("../utils/log")

/**
 * Register Employee
 **/
exports.agentEmployeeRegister = function (req) {
    return new Promise(function (resolve, reject) {

        const { title, firstname, lastname, email, phoneNumber, username, password, description, workBeginDate, status } = req.body

        if (title && firstname && lastname && email || email == '' && phoneNumber || phoneNumber == '' && username && password && description || description == '' && workBeginDate && status) {
            (async () => {
                const employeeTable = mysqlConnector.employee

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
                if (checkDuplucatedUsername) return reject(respConvert.businessError(msgConstant.agent.duplicate_user))

                //Encrypt user password
                const encryptedPassword = await bcrypt.hash(password, 10);

                const agentTable = mysqlConnector.agent

                const agentInfo = await agentTable.findOne({
                    where: {
                        id: req.user.id
                    },
                    attributes: ['agentName', 'agentRefCode'],
                    raw: true
                });

                const employeeCreated = await employeeTable.create({
                    agentRefCode: agentInfo.agentRefCode,
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
                    createBy: req.user.id,
                    createDateTime: new Date(),
                    updateBy: req.user.id,
                    updateDateTime: new Date(),
                });

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('register', null, 'employee', employeeCreated.id, req.user.id)

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
 * List employee
 **/
exports.listEmployeeByAgentId = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {
            const employeeTable = mysqlConnector.employee;

            const employeeList = await employeeTable.findAll({
                where: {
                    createBy: {
                        [Op.eq]: req.user.id
                    }
                },
                attributes: ['id', 'title', 'firstname', 'lastname', 'phoneNumber', 'email', 'username', 'status'],
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

            const { empId } = req.body
            const employeeTable = mysqlConnector.employee;
            const employeeLogTable = mysqlConnector.employeeLog

            const employeeInfo = await employeeTable.findOne({
                where: {
                    id: empId
                },
                attributes: ['id', 'title', 'firstname', 'lastname', 'phoneNumber', 'workBeginDate'],
                raw: true
            })


            //find total player credit by agent
            const listEmployeeLogs = await employeeLogTable.findAll({
                where: {
                    createBy: empId
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
 * Get employee info when employee login.
 **/
exports.getEmployeeInfo = function (req) {
    return new Promise(function (resolve, reject) {
        (async () => {

            const employeeTable = mysqlConnector.employee;
            const employeeLogTable = mysqlConnector.employeeLog

            const employeeInfo = await employeeTable.findOne({
                where: {
                    id: req.user.id
                },
                attributes: ['id', 'title', 'firstname', 'lastname', 'phoneNumber', 'workBeginDate'],
                raw: true
            })

            //find employee log
            const listEmployeeLogs = await employeeLogTable.findAll({
                where: {
                    createBy: req.user.id
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

        const { employeeId } = req.body

        if (employeeId) {

            (async () => {

                const employeeTable = mysqlConnector.employee

                await employeeTable.update(
                    {
                        status: 'banned'
                    },
                    {
                        where: { id: employeeId }
                    }
                )

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('ban', null, 'employee', employeeId, req.user.id)

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

        const { employeeId } = req.body

        if (employeeId) {

            (async () => {

                const employeeTable = mysqlConnector.employee

                await employeeTable.update(
                    {
                        status: 'active'
                    },
                    {
                        where: { id: employeeId }
                    }
                )

                //(type, ref, desc, userId, createBy) 
                await utilLog.agentLog('unban', null, 'employee', employeeId, req.user.id)

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




function setEmployeeLogs(listEmployeeLogs) {
    //find employee logs
    let employeeLogs = []
    listEmployeeLogs.forEach(element => {
        let logObj = {}
        logObj._id = element.id;
        logObj.dateTime = element.createDateTime;
        logObj.action = element.description;
        employeeLogs.push(logObj)
    });

    return employeeLogs;
}