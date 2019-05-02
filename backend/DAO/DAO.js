/* MongoDB Related Code */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'shutterAssignment';
const collectionName = 'customerData';
// Create a new MongoClient

/* Mongo DB Ends*/

function read(coll, findParams, callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection= db.collection(coll)

        collection.find(findParams).toArray(function(err, docs) {
            assert.equal(err, null);
            callback(docs)
        });
        client.close();
    })
}

function readAll(coll ,callback){
    read(coll, {}, (result) => {callback(result)})
}

function readWithFilter(coll ,filter, callback){
    read(coll , filter, (result) => {callback(result)})
}

function create(data,callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection= db.collection(collectionName)

        collection.insertOne(data,(err,r)=>{
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            client.close();
            callback()
        })
    })
}


module.exports = {
    "create" : create,
    "readAll" : readAll,
    "readWithFilter" : readWithFilter
};