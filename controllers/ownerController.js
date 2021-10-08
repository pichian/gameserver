'use strict';

const utils = require('../utils/writer.js');
const middleWare = require('../middleware/auth')
const ownerService = require('../service/ownerService');
const agentService = require('../service/agentService')

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
  ownerService.listAgentByOwnerId(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.listAgentPaymentRequestAll = function listAgentPaymentRequestAll(req, res, next) {
  ownerService.listAgentPaymentRequestAll(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

/************************ Main Operation of Owner*************************/










/************************ Agent Operation By Owner*************************/

module.exports.findAgentWalletById = function findAgentWalletById(req, res, next) {
  agentService.findAgentWalletById(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.getAgentInfo = function getAgentInfo(req, res, next) {
  agentService.getAgentInfo(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.agentPaymentRequestByOwner = function agentPaymentRequestByOwner(req, res, next) {
  agentService.agentPaymentRequestByOwner(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.paymentRequestListOfAgent = function paymentRequestListOfAgent(req, res, next) {
  agentService.paymentRequestListOfAgent(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.getAgentPaymentDetailById = function getAgentPaymentDetailById(req, res, next) {
  agentService.getAgentPaymentDetailById(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};


module.exports.approveAgentPaymentRequest = function approveAgentPaymentRequest(req, res, next) {
  agentService.approveAgentPaymentRequest(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.disapproveAgentPaymentRequest = function disapproveAgentPaymentRequest(req, res, next) {
  agentService.disapproveAgentPaymentRequest(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.cancelAgentPaymentRequest = function cancelAgentPaymentRequest(req, res, next) {
  agentService.cancelAgentPaymentRequest(req)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

/************************ Agent Operation By Owner*************************/



module.exports.ownerRegister = function ownerRegister(req, res, next, body) {
  ownerService.ownerRegister(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};


