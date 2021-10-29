const { MongoClient } = require("mongodb");

module.exports.mongo = function (callback) {
    MongoClient.connect('mongodb://root:example1234@157.245.205.111:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, dbs) {
        if (err) {
            console.error('Err ' + err.message);
            callback(false);
        } else {
            module.exports.api = dbs.db("lotto");
            module.exports.lottogame = dbs.db("lottogame")
            callback(true);
        }
    });
}