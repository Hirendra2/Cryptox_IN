const { MongoClient } = require("mongodb");
 //const url = "mongodb://admin:UV9ihOGii0QYRlK0@64.227.177.68:27017/";

 //
 const url = "mongodb+srv://doadmin:uc08d9L5QD6y72K1@db-mongodb-blr1-22124-a75039a0.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-22124";

 //const url ='mongodb://localhost:27017';

var _db;


module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, client) {
        if (err) {
          setTimeout(handleDisconnect, 1000);
          console.log(err);
        }
        
        try {
          _db = client.db("test"); //fufibusiness
        } catch (ex) {
          setTimeout(handleDisconnect, 1000);
        }

        return callback(err);
      }
    );
  },
  getDb: function () {
    return _db;
  },
};

function handleDisconnect() {
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, client) {
      if (err) {
        setTimeout(handleDisconnect, 1000);
        console.log(err);
      }
      try {
        _db = client.db("test"); //fufibusiness
      } catch (ex) {
        setTimeout(handleDisconnect, 1000);
      }
    }
  );
}
