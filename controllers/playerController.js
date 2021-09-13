'use strict';

var utils = require('../utils/writer.js');
var playerService = require('../service/playerService');

/************************Player Operation *************************/

module.exports.loginPlayer = function loginPlayer(req, res, next, body) {
  playerService.loginPlayer(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.logoutPlayer = function logoutPlayer(req, res, next, body) {
  playerService.logoutPlayer(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.registerPlayer = function registerPlayer(req, res, next, body) {
  playerService.registerPlayer(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};
/************************Player Operation*************************/

// module.exports.findById = function findById(req, res, next) {
//   Player.findById(req)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getplayerById = function getplayerById(req, res, next, paymentId) {
//   Player.getplayerById(paymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listplayerPaymentRequest = function listplayerPaymentRequest(req, res, next) {
//   //authtoken(req, res, next).then(function () {

//     Player.listplayerPaymentRequest(req)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });

//  // })

// };

// module.exports.loginPlayer = function loginPlayer(req, res, next, body) {
//   Player.loginPlayer(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.logoutPlayer = function logoutPlayer(req, res, next) {


//   authtoken(req, res, next).then(function () {
//     Player.logoutPlayer(req)
//       .then(function (response) {
//         utils.writeJson(res, response);
//       })
//       .catch(function (response) {
//         utils.writeJson(res, response);
//       });
//   })


// };


// module.exports.playerPaymentRequest = function playerPaymentRequest(req, res, next, body) {
//   Player.playerPaymentRequest(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.registerPlayer = function registerPlayer(req, res, next, body) {
//   Player.registerPlayer(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.updatePlayerDetail = function updatePlayerDetail(req, res, next, body) {

//   // authtoken(req, res, next).then(async function () {
//   //   await Player.updatePlayerDetail(req, body);
//   //   await new Promise(() => utils.writeJson(res, response));
//   // })

//   authtoken(req, res, next).then(function () {
//     Player.updatePlayerDetail(req, body)
//       .then(function (response) {
//         utils.writeJson(res, response);
//       })
//       .catch(function (response) {
//         utils.writeJson(res, response);
//       });
//   })


//   // Player.updatePlayerDetail(req, body)
//   // .then(function (response) {
//   //   utils.writeJson(res, response);
//   // })
//   // .catch(function (response) {
//   //   utils.writeJson(res, response);
//   // });



// };
