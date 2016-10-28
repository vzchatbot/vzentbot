var MongoClient = require("mongodb").MongoClient,
    Connection = require("mongodb").Connection,
    Server = require("mongodb").Server;

Users = function(host, port) {
  var mongoClient = new MongoClient(new Server(host, port));
  mongoClient.open(function (){});
  this.db = mongoClient.db("dbname");
};

Users.prototype.getCollection = function (callback) {
  this.db.collection("users", function (error, users) {
    if (error) callback(error);
    else callback(null, users);
  });
};

Users.prototype.findAll = function (callback) {
  this.getCollection(function (error, users) {
    if (error) {
      callback(error);
    } else {
      users.find().toArray(function (error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null,results);
        }
      });
    }
  });
}

// Bunch of other prototype functions...

exports.Users = Users;
