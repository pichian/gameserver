'use strict';


/**
 * Finds wallet player by token key
 * Finds wallet player detail by token key.
 *
 * returns List
 **/
exports.findById = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "amountCoin" : 6.027456183070403,
  "coinList" : [ {
    "key" : ""
  }, {
    "key" : ""
  } ],
  "userid" : 0
}, {
  "amountCoin" : 6.027456183070403,
  "coinList" : [ {
    "key" : ""
  }, {
    "key" : ""
  } ],
  "userid" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * payment player detail
 * Returns a single pet
 *
 * paymentId Long ID of pet to return
 * returns PaymentModel
 **/
exports.getplayerById = function(paymentId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "Status" : "Status",
  "agentId" : 6,
  "Amount" : 1.4658129805029452,
  "id" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * List agent payment request
 *
 * returns PaymentModel
 **/
exports.listplayerPaymentRequest = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "Status" : "Status",
  "agentId" : 6,
  "Amount" : 1.4658129805029452,
  "id" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs user into the system
 *
 * body PlayerLoginInput ไว้ Login
 * returns inline_response_200
 **/
exports.loginPlayer = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "token" : "token"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs out current logged in user session
 *
 * no response value expected for this operation
 **/
exports.logoutPlayer = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * agent payment request
 *
 * body PaymentModel Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.playerPaymentRequest = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * register Player
 *
 * body PlayerModel register new player witch agent refcode
 * no response value expected for this operation
 **/
exports.registerPlayer = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update player detail
 *
 * body PlayerPutInput update Player Detail
 * no response value expected for this operation
 **/
exports.updatePlayerDetail = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

