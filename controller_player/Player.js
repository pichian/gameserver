'use strict';

var utils = require('../utils/writer.js');
var Player = require('../service/PlayerService');

module.exports.findById = function findById (req, res, next) {
  Player.findById()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getplayerById = function getplayerById (req, res, next, paymentId) {
  Player.getplayerById(paymentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listplayerPaymentRequest = function listplayerPaymentRequest (req, res, next) {
  Player.listplayerPaymentRequest()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginPlayer = function loginPlayer (req, res, next, body) {
  Player.loginPlayer(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutPlayer = function logoutPlayer (req, res, next) {
  Player.logoutPlayer()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.playerPaymentRequest = function playerPaymentRequest (req, res, next, body) {
  Player.playerPaymentRequest(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerPlayer = function registerPlayer (req, res, next, body) {
  Player.registerPlayer(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updatePlayerDetail = function updatePlayerDetail (req, res, next, body) {
  Player.updatePlayerDetail(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
