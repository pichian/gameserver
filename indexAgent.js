'use strict';

var path = require('path');
var http = require('http');
const express = require('express')
var oas3Tools = require('oas3-tools');
var serverPort = 62;
var cors = require("cors");
const mongo = require('./connector/mongodb');
const app = express();
require('dotenv').config()

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi_agent.yaml'), options);

const openApiApp = expressAppConfig.getApp();

app.use(/.*/, cors());

for (let i = 2; i < openApiApp._router.stack.length; i++) {
    app._router.stack.push(openApiApp._router.stack[i])
}

mongo.mongo(function (db) {
    if (db !== false) {
        // Initialize the Swagger middleware
        http.createServer(app).listen(serverPort, function () {
            console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
            console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        });
    } else {
        throw 'mongo database error';
    }
});