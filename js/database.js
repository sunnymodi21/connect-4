var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("connect-4");
//     var myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("customers").insertOne(myobj, function(err, res) {
//       if (err) throw err;
//       console.log("1 document inserted");
//       db.close();
//     });
//   });

class MongoDB{
    constructor(){
        this.db = {}
    }

    async connect(dbName){
        var db = await MongoClient.connect(url, {useNewUrlParser: true})
        this.db = db.db("connect-4")
    }

    async insert(myobj){
        var myobj = { name: "Company Inc", address: "Highway 37" };
        this.db.collection("customers").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    }
} 
  
module.exports = {MongoDB}