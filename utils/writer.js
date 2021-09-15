exports.writeSuccess = function (response, objMessage) {
  var objResponse = {}

  if (objMessage.data) objResponse.data = objMessage.data
  if (objMessage.token) objResponse.token = objMessage.token

  objResponse.code = "LTR-200";
  objResponse.message = objMessage.message;

  response.setHeader('Content-Type', 'application/json');
  response.status(200)
  response.json(objResponse);
}

exports.writeError = function (response, objMessage) {
  var objResponse = {}

  objResponse.code = objMessage.responseCode;
  objResponse.message = objMessage.responseMessage;

  response.setHeader('Content-Type', 'application/json');
  response.status(200)
  response.json(objResponse);
}