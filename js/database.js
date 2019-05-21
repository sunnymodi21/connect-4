var MongoClient = require('mongodb').MongoClient;
var uri = process.env.DATABASE_URI || "mongodb://localhost:27017/";
class MongoDB{
    constructor(){
        this.db = {}
    }

    async connect(dbName){
        var db = await MongoClient.connect(uri, {useNewUrlParser: true})
        this.db = db.db(dbName)
    }

    insert(final_matrix){
        var xyz = this
        this.db.collection("games").insertOne({final_matrix}, function(err, res) {
            if (err) throw err
            console.log("1 document inserted")
        });
    }

    getAllGames(){
        this.db.collection("games").find().toArray(function(err, docs) {
            if(err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        })
    }

    async close(){
        this.db.close()
    }
} 
  
module.exports = MongoDB