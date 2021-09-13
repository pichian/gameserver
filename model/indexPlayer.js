
const Sequelize = require("sequelize");
const config = process.env
config.SQL_DB_NAME_PLAYER = 'player'
config.SQL_DB_HOST_PLAYER = '128.199.216.219'
config.SQL_DB_USERNAME_PLAYER = 'root'
config.SQL_DB_PASSWORD_PLAYER = '78!KDNdrf3gU9%J'
//console.log(config);
//console.log(config.SQL_DB_NAME_PLAYER);

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

db.Player = require("./player.js")(sequelize, Sequelize);
db.SessionPlayer = require("./SessionPlayer.js")(sequelize, Sequelize);
db.Payment = require("./payment.js")(sequelize, Sequelize);
module.exports = db;