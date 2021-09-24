exports.writeSuccess = function (response, objMessage) {
  var objResponse = {}

  objResponse.code = "LTR-200";
  objResponse.message = objMessage.responseMessage;

  if (objMessage.data) objResponse.data = objMessage.data
  if (objMessage.token) objResponse.token = objMessage.token
  if (objMessage.newToken) objResponse.newToken = objMessage.newToken

  // console.log('Success ' + JSON.stringify(objResponse))
  response.setHeader('Content-Type', 'application/json');
  response.status(200)
  response.json(objResponse);
}

exports.writeError = function (response, objMessage) {
  var objResponse = {}

  objResponse.code = objMessage.responseCode;
  objResponse.message = objMessage.responseMessage;

  // console.log('Error ' + JSON.stringify(objResponse))
  response.setHeader('Content-Type', 'application/json');
  response.status(200)
  response.json(objResponse);
}