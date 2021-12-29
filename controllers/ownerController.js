'use strict';

const utils = require('../utils/writer.js');
const middleWare = require('../middleware/auth')
const ownerService = require('../service/ownerService');
const agentService = require('../service/agentService')
const employeeService = require('../service/employeeService')
const playerService = require('../service/playerService')
const promotionService = require('../service/promotionService')

/************************ Main Operation of Owner*************************/

module.exports.loginOwner = function loginOwner(req, res, next, body) {
  ownerService.loginOwner(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.logoutOwner = function logoutOwner(req, res, next) {
  ownerService.logoutOwner(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.findOwnerDetail = function findOwnerDetail(req, res, next) {
  middleWare.authToken(req).then(function () {
    ownerService.findOwnerDetail(req)
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


module.exports.ownerAgentRegister = function ownerAgentRegister(req, res, next, body) {
  middleWare.authToken(req).then(function () {
    ownerService.ownerAgentRegister(req)
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

module.exports.listAgentByOwnerId = function listAgentByOwnerId(req, res, next) {
  middleWare.authToken(req).then(function () {
    ownerService.listAgentByOwnerId(req)
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

module.exports.listAgentPaymentRequestAll = function listAgentPaymentRequestAll(req, res, next) {
  middleWare.authToken(req).then(function () {
    ownerService.listAgentPaymentRequestAll(req)
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

/************************ Main Operation of Owner*************************/










/************************ Agent Operation By Owner*************************/

module.exports.findAgentWalletById = function findAgentWalletById(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.findAgentWalletById(req)
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

module.exports.getAgentInfo = function getAgentInfo(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.getAgentInfo(req)
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

module.exports.agentPaymentRequestByOwner = function agentPaymentRequestByOwner(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.agentPaymentRequestByOwner(req)
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

module.exports.paymentRequestListOfAgent = function paymentRequestListOfAgent(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.paymentRequestListOfAgent(req)
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

module.exports.agentPaymentRequestListDataAndSum = function agentPaymentRequestListDataAndSum(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.agentPaymentRequestListDataAndSum(req)
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

module.exports.getAgentPaymentDetailById = function getAgentPaymentDetailById(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.getAgentPaymentDetailById(req)
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


module.exports.approveAgentPaymentRequest = function approveAgentPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.approveAgentPaymentRequest(req)
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

module.exports.disapproveAgentPaymentRequest = function disapproveAgentPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.disapproveAgentPaymentRequest(req)
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

module.exports.cancelAgentPaymentRequest = function cancelAgentPaymentRequest(req, res, next) {
  middleWare.authToken(req).then(function () {
    agentService.cancelAgentPaymentRequest(req)
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

/************************ Agent Operation By Owner*************************/









/************************ Employee Operation By Owner*************************/
module.exports.listEmployee = function listEmployee(req, res, next) {
  middleWare.authToken(req).then(function () {
    employeeService.listEmployee(req)
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
module.exports.listPlayer = function listPlayer(req, res, next) {
  middleWare.authToken(req).then(function () {
    playerService.listPlayer(req)
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

module.exports.promotionUpdate = function promotionUpdate(req, res, next, body) {
  middleWare.authToken(req).then(function () {
    promotionService.promotionUpdate(req)
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

module.exports.promotionStop = function promotionStop(req, res, next, body) {
  middleWare.authToken(req).then(function () {
    promotionService.promotionStop(req)
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

module.exports.listPromotionAll = function listPromotionAll(req, res, next) {
  middleWare.authToken(req).then(function () {
    promotionService.listPromotionAll(req)
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