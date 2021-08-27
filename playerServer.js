'use strict';
require("dotenv").config();
var path = require('path');
var http = require('http');
const express = require('express')
var oas3Tools = require('oas3-tools');
var serverPort = 61;
var cors = require("cors");
const app = express();

const config = process.env

const { Sequelize } = require('sequelize');

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);

const openApiApp = expressAppConfig.getApp();

app.use(/.*/, cors());

for (let i = 2; i < openApiApp._router.stack.length; i++) {
    app._router.stack.push(openApiApp._router.stack[i])
}

const sequelize = new Sequelize(config.SQL_DB_NAME_PLAYER, config.SQL_DB_USERNAME_PLAYER, config.SQL_DB_PASSWORD_PLAYER, {
    host: config.SQL_DB_HOST_PLAYER,
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});


(async () => {

    try {
        await sequelize.authenticate();
        //console.log('Connection has been established successfully.');
    
        // Initialize the Swagger middleware
        http.createServer(app).listen(serverPort, function () {
            console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
            console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        });
    
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }


})();



