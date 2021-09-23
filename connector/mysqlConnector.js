const { Sequelize } = require('sequelize');
const config = process.env

config.SQL_DB_NAME = 'lotto'
config.SQL_DB_HOST = '128.199.216.219'
config.SQL_DB_USERNAME = 'root'
config.SQL_DB_PASSWORD = '78!KDNdrf3gU9%J'

const sequelizeConnector = new Sequelize(config.SQL_DB_NAME, config.SQL_DB_USERNAME, config.SQL_DB_PASSWORD, {
    host: config.SQL_DB_HOST,
    dialect: 'mysql',
    timezone: '+07:00',
    logging: false
});

const db = {};

db.player = require("../model/player")(sequelizeConnector, Sequelize);
db.sessionPlayer = require("../model/sessionPlayer")(sequelizeConnector, Sequelize);
db.playerPaymentReq = require("../model/playerPaymentRequest")(sequelizeConnector, Sequelize);

db.agent = require("../model/agent")(sequelizeConnector, Sequelize)
db.sessionAgent = require("../model/sessionAgent")(sequelizeConnector, Sequelize)
db.agentPaymentReq = require("../model/agentPaymentRequest")(sequelizeConnector, Sequelize)

db.promotion = require('../model/promotion')(sequelizeConnector, Sequelize)
db.employee = require('../model/employee')(sequelizeConnector, Sequelize)

module.exports = db;