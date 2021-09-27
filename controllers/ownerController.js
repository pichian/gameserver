'use strict';

const utils = require('../utils/writer.js');
const middleWare = require('../middleware/auth')
const ownerService = require('../service/ownerService');


module.exports.ownerAgentRegister = function ownerAgentRegister(req, res, next, body) {
  ownerService.ownerAgentRegister(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
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

// module.exports.agentPaymentRequest = function agentPaymentRequest (req, res, next, body) {
//   Owner.agentPaymentRequest(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.agentmpoyee = function agentmpoyee (req, res, next, body) {
//   Owner.agentmpoyee(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.approveagentpayment = function approveagentpayment (req, res, next, agentPaymentId) {
//   Owner.approveagentpayment(agentPaymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.findById = function findById (req, res, next) {
//   Owner.findById()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getagentById = function getagentById (req, res, next, paymentId) {
//   Owner.getagentById(paymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getplayerById = function getplayerById (req, res, next, paymentId) {
//   Owner.getplayerById(paymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listAgentPaymentRequest = function listAgentPaymentRequest (req, res, next) {
//   Owner.listAgentPaymentRequest()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listPlayer = function listPlayer (req, res, next) {
//   Agent.listPlayer()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listplayerPaymentRequest = function listplayerPaymentRequest (req, res, next) {
//   Owner.listplayerPaymentRequest()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.loginowner = function loginowner (req, res, next, body) {
//   Owner.loginowner(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.logoutowner = function logoutowner (req, res, next) {
//   Owner.logoutowner()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };
