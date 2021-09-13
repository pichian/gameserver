var MongoClient = require('mongodb').MongoClient;
module.exports.mongo = function (callback) {
    MongoClient.connect('mongodb://user:password@167.71.201.86:27017/?authSource=dbName',{useNewUrlParser: true, useUnifiedTopology: true}, function (err, dbs) {
            if (err) {
			console.error(err.message);
            callback(false);
        } else {
            module.exports.api = dbs.db("dbName");
            callback(true);
        }
    });
}