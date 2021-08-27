'use strict';

var utils = require('../utils/writer.js');
var Agent = require('../service/AgentService');

module.exports.agentPaymentRequest = function agentPaymentRequest (req, res, next, body) {
  Agent.agentPaymentRequest(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.agentmpoyee = function agentmpoyee (req, res, next, body) {
  Agent.agentmpoyee(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.approveplayerpayment = function approveplayerpayment (req, res, next, playerPaymentId) {
  Agent.approveplayerpayment(playerPaymentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.findById = function findById (req, res, next) {
  Agent.findById()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getagentById = function getagentById (req, res, next, paymentId) {
  Agent.getagentById(paymentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getplayerById = function getplayerById (req, res, next, paymentId) {
  Agent.getplayerById(paymentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listagentPaymentRequest = function listagentPaymentRequest (req, res, next) {
  Agent.listagentPaymentRequest()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listPlayer = function listPlayer (req, res, next) {
  Agent.listPlayer()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listplayerPaymentRequest = function listplayerPaymentRequest (req, res, next) {
  Agent.listplayerPaymentRequest()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listplayerPaymentRequestagent = function listplayerPaymentRequestagent (req, res, next) {
  Agent.listplayerPaymentRequestagent()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginagent = function loginagent (req, res, next, body) {
  Agent.loginagent(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginemployee = function loginemployee (req, res, next, body) {
  Agent.loginemployee(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutagent = function logoutagent (req, res, next) {
  Agent.logoutagent()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutemployee = function logoutemployee (req, res, next) {
  Agent.logoutemployee()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.playerAgentRequest = function playerAgentRequest (req, res, next, body) {
  Agent.playerAgentRequest(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.playerAgentRequestupdate = function playerAgentRequestupdate (req, res, next, body) {
  Agent.playerAgentRequestupdate(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerPlayer = function registerPlayer (req, res, next, body) {
  Agent.registerPlayer(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerempoyee = function registerempoyee (req, res, next, body) {
  Agent.registerempoyee(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateempoyeeDetail = function updateempoyeeDetail (req, res, next, body) {
  Agent.updateempoyeeDetail(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
