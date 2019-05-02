/* MongoDB Related Code */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'shutterAssignment';
//const collectionName = 'customerData';
// Create a new MongoClient

/* Mongo DB Ends*/

function read(coll, findParams, callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection= db.collection(coll);

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

function insert(coll, data,callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection= db.collection(coll);

        collection.insertOne(data,(err,r)=>{
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            client.close();
            callback()
        })
    })
}

function getNextSequenceValue(sequenceName, callback){
    var client = new MongoClient(url);
    client.connect((err)=> {
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection= db.collection("counters");

        collection.find({"_id":sequenceName}).toArray(function(err, docs) {
            collection.updateOne({"_id":sequenceName}, {$inc:{"sequence_value":1}});
            assert.equal(err, null);
            callback(docs);
        });
    });
}

function update(data, callback){
    //TODO
}

function remove(data, callback){
    //TODO
}


module.exports = {
    "insert" : insert,
    "readAll" : readAll,
    "readWithFilter" : readWithFilter,
    "getNextSequenceValue" : getNextSequenceValue
};