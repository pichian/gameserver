'use strict';

const utils = require('../utils/writer.js');
const playerService = require('../service/playerService');
const middleWare = require('../middleware/auth')

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

module.exports.logoutPlayer = function logoutPlayer(req, res, next) {
  playerService.logoutPlayer(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.authenPlayerToken = function authenPlayerToken(req, res, next) {
  middleWare.authToken(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

/********** */
module.exports.registerPlayer = function registerPlayer(req, res, next) {
  playerService.registerPlayer(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.getPlayerInfo = function getPlayerInfo(req, res) {
  middleWare.authToken(req).then(function () {
    playerService.getPlayerInfo(req)
      .then(function (response) {
        utils.writeSuccess(res, response);
      })
      .catch(function (response) {
        utils.writeError(res, response);
      });
  }).catch(function (response) {
    utils.writeError(res, response);
  });
};

module.exports.getPlayerWallet = function getPlayerWallet(req, res) {
  middleWare.authToken(req).then(function () {
    playerService.getPlayerWallet(req)
      .then(function (response) {
        utils.writeSuccess(res, response);
      })
      .catch(function (response) {
        utils.writeError(res, response);
      });
  }).catch(function (response) {
    utils.writeError(res, response);
  });
};

module.exports.playerPaymentRequest = function playerPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.playerPaymentRequest(req)
      .then(function (response) {
        utils.writeSuccess(res, response);
      })
      .catch(function (response) {
        utils.writeError(res, response);
      });
  }).catch(function (response) {
    utils.writeError(res, response);
  });
};

module.exports.listPlayerPaymentRequest = function listPlayerPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.listPlayerPaymentRequest(req)
      .then(function (response) {
        utils.writeSuccess(res, response);
      })
      .catch(function (response) {
        utils.writeError(res, response);
      });
  }).catch(function (response) {
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
