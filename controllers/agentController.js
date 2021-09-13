'use strict';

var utils = require('../utils/writer.js');
var agentService = require('../service/agentService');

/************************Player Operation By Agent*************************/
module.exports.listPlayerByAgentId = function listPlayerByAgentId(req, res, next) {
  agentService.listPlayerByAgentId()
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.agentPlayerRegister = function agentPlayerRegister(req, res, next, body) {
  agentService.agentPlayerRegister(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};
/************************Player Operation By Agent*************************/





/************************Employee Operation By Agent*************************/

module.exports.agentEmployeeRegister = function agentEmployeeRegister(req, res, next, body) {
  agentService.agentEmployeeRegister(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.listEmployeeByAgentId = function listEmployeeByAgentId(req, res, next) {
  agentService.listEmployeeByAgentId()
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
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
  agentService.promotionCreate(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};

module.exports.listPromotionByAgentId = function listPromotionByAgentId(req, res, next) {
  agentService.listPromotionByAgentId()
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      utils.writeError(res, response);
    });
};



/************************Promotion Operation By Agent*************************/



// module.exports.agentPaymentRequest = function agentPaymentRequest(req, res, next, body) {
//   agentService.agentPaymentRequest(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.agentmpoyee = function agentmpoyee(req, res, next, body) {
//   agentService.agentmpoyee(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.approvePlayerPayment = function approvePlayerPayment(req, res, next, playerPaymentId) {
//   agentService.approvePlayerPayment(playerPaymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.findById = function findById(req, res, next) {
//   agentService.findById()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getPaymentDetail = function getPaymentDetail(req, res, next, paymentId) {
//   agentService.getPaymentDetail(paymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getplayerById = function getplayerById(req, res, next, paymentId) {
//   agentService.getplayerById(paymentId)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listAgentPaymentRequest = function listAgentPaymentRequest(req, res, next) {
//   agentService.listAgentPaymentRequest()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };


// module.exports.listplayerPaymentRequest = function listplayerPaymentRequest(req, res, next) {
//   agentService.listplayerPaymentRequest()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.listplayerPaymentRequestagent = function listplayerPaymentRequestagent(req, res, next) {
//   agentService.listplayerPaymentRequestagent()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.loginAgent = function loginAgent(req, res, next, body) {
//   agentService.loginAgent(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.loginemployee = function loginemployee(req, res, next, body) {
//   agentService.loginemployee(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.logoutAgent = function logoutAgent(req, res, next, headers) {
//   console.log(headers);
//   agentService.logoutAgent()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.logoutemployee = function logoutemployee(req, res, next) {
//   agentService.logoutemployee()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.playerAgentRequest = function playerAgentRequest(req, res, next, body) {
//   agentService.playerAgentRequest(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.playerAgentRequestupdate = function playerAgentRequestupdate(req, res, next, body) {
//   agentService.playerAgentRequestupdate(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };


/***********This for test purpose only. (This will move to ownerController next time)**********/
module.exports.registerAgent = function registerAgent(req, res, next, body) {
  agentService.registerAgent(body)
    .then(function (response) {
      utils.writeSuccess(res, response);
    })
    .catch(function (response) {
      console.error('[Error]:Ctrl, registerAgent =>' + response.message);
      utils.writeError(res, response);
    });
};
/***********This for test purpose only. **********/