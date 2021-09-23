const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const mysqlConnector = require("../connector/mysqlConnector")
const respConvert = require("../utils/responseConverter");
const msgConstant = require("../constant/messageMapping");

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

                const employeeCreate = await employeeTable.create({
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

        const employeeTable = mysqlConnector.employee;

        (async () => {
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