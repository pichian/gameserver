'use strict';

const utils = require('../utils/writer.js');
const middleWare = require('../middleware/auth')
const agentService = require('../service/agentService');
const promotionService = require('../service/promotionService')
const employeeService = require('../service/employeeService')
const playerService = require('../service/playerService')


/************************ Main Agent Operation*************************/

module.exports.loginAgent = function loginAgent(req, res, next, body) {
  agentService.loginAgent(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.logoutAgent = function logoutAgent(req, res, next) {
  agentService.logoutAgent(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.findAgentDetail = function findAgentDetail(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.findAgentDetail(req)
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

module.exports.agentPaymentRequest = function agentPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.agentPaymentRequest(req)
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

module.exports.listAgentPaymentRequest = function listAgentPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.listAgentPaymentRequest(req)
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

module.exports.getPaymentDetailById = function getPaymentDetailById(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.getPaymentDetailById(req)
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


/************************ Main Agent Operation*************************/










/************************Player Operation By Agent*************************/
module.exports.listPlayerByAgentId = function listPlayerByAgentId(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.listPlayerByAgentId(req)
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

module.exports.agentPlayerRegister = function agentPlayerRegister(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.agentPlayerRegister(req)
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

module.exports.listPlayerPaymentRequestAll = function listPlayerPaymentRequestAll(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.listPlayerPaymentRequestAll(req)
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

module.exports.paymentRequestListOfPlayer = function paymentRequestListOfPlayer(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.paymentRequestListOfPlayer(req)
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


module.exports.findPlayerWalletById = function findPlayerWalletById(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.findPlayerWalletById(req)
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


module.exports.findPlayerInfo = function findPlayerInfo(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.findPlayerInfo(req)
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

module.exports.playerPaymentRequestByAgent = function playerPaymentRequestByAgent(req, res, next) {
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

module.exports.getPlayerPaymentDetailById = function getPlayerPaymentDetailById(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.getPlayerPaymentDetailById(req)
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

module.exports.approvePlayerPaymentRequest = function approvePlayerPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.approvePlayerPaymentRequest(req)
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

module.exports.disapprovePlayerPaymentRequest = function disapprovePlayerPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.disapprovePlayerPaymentRequest(req)
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

module.exports.cancelPlayerPaymentRequest = function cancelPlayerPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.cancelPlayerPaymentRequest(req)
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

module.exports.banPlayer = function banPlayer(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.banPlayer(req)
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

module.exports.unBanPlayer = function unBanPlayer(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.unBanPlayer(req)
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

/************************Player Operation By Agent*************************/










/************************Employee Operation By Agent*************************/

module.exports.agentEmployeeRegister = function agentEmployeeRegister(req, res, next) {
  middleWare.authToken(req).then(function () {
    employeeService.agentEmployeeRegister(req)
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

module.exports.listEmployeeByAgentId = function listEmployeeByAgentId(req, res, next) {
  middleWare.authToken(req).then(function () {
    employeeService.listEmployeeByAgentId(req)
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

module.exports.getEmployeeDetail = function getEmployeeDetail(req, res, next) {
  middleWare.authToken(req).then(function () {
    employeeService.getEmployeeDetail(req)
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

module.exports.getEmployeeInfo = function getEmployeeInfo(req, res, next) {
  middleWare.authToken(req).then(function () {
    employeeService.getEmployeeInfo(req)
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

// module.exports.updateempoyeeDetail = function updateempoyeeDetail(req, res, next, body) {
//   agentService.updateempoyeeDetail(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };
/************************Employee Operation By Agent*************************/




/************************Promotion Operation By Agent*************************/
module.exports.promotionCreate = function promotionCreate(req, res, next, body) {
  middleWare.authToken(req).then(function () {
    promotionService.promotionCreate(req)
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

module.exports.listPromotionByAgentId = function listPromotionByAgentId(req, res, next) {
  middleWare.authToken(req).then(function () {
    promotionService.listPromotionByAgentId(req)
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

module.exports.getPromotionDetailById = function getPromotionDetailById(req, res, next) {
  middleWare.authToken(req).then(function () {
    promotionService.getPromotionDetailById(req)
      .then(function (response) {
        utils.writeSuccess(res, response);
      })
      .catch(function (response) {
        utils.writeError(res, response);
      });
  }).catch(function (response) {
    utils.writeError(res, response);
  });
}

/************************Promotion Operation By Agent*************************/