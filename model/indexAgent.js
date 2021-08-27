
const Sequelize = require("sequelize");
const config = process.env

//console.log(config);
//console.log(config.SQL_DB_NAME_PLAYER);
config.SQL_DB_NAME_PLAYER = 'agent'
config.SQL_DB_HOST_PLAYER = '128.199.216.219'
config.SQL_DB_USERNAME_PLAYER = 'root'
config.SQL_DB_PASSWORD_PLAYER = '78!KDNdrf3gU9%J'

const sequelize = new Sequelize(config.SQL_DB_NAME_PLAYER, config.SQL_DB_USERNAME_PLAYER, config.SQL_DB_PASSWORD_PLAYER, {
    host: config.SQL_DB_HOST_PLAYER,
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */

    // pool: {
    //     max: 15,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // }
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Agent = require("./agent.js")(sequelize, Sequelize);
db.Payment = require("./payment.js")(sequelize, Sequelize);
db.SessionAgent = require("./SessionAgent.js")(sequelize, Sequelize);

module.exports = db;