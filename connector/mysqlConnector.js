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

db.Player = require("../model/player")(sequelizeConnector, Sequelize);
db.sessionPlayer = require("../model/sessionPlayer")(sequelizeConnector, Sequelize);

module.exports = db;