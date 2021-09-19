exports.writeSuccess = function (response, objMessage) {
  var objResponse = {}

  objResponse.code = "LTR-200";
  objResponse.message = objMessage.responseMessage;

  if (objMessage.data) objResponse.data = objMessage.data
  if (objMessage.token) objResponse.token = objMessage.token

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