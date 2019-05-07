const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'shutterAssignment';

//Read from database
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

//Read everything
function readAll(coll ,callback){
    read(coll, {}, (result) => {callback(result)})
}

//Read filtered data
function readWithFilter(coll ,filter, callback){
    read(coll , filter, (result) => {callback(result)})
}

//InsertOne into doatabase
function insertOne(coll, data,callback){
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

//InsertMany into doatabase
function insertMany(coll, data,callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection= db.collection(coll);

        collection.insertMany(data,(err,r)=>{
            assert.equal(null, err);
            client.close();
            callback()
        })
    })
}

//Get generated id
function getNextSequenceValue(sequenceName){
    return new Promise( async resolve =>{
        var client = new MongoClient(url);
        await client.connect((err)=> {
            assert.equal(null, err);

            const db = client.db(dbName);
            const collection= db.collection("counters");

            collection.updateOne({"_id":sequenceName}, {$inc:{"sequence_value":1}},() =>{
                resolve(collection.find({"_id":sequenceName}).toArray());
            });
        });
    })
}

//Update data
function updateOne(coll, select, data, callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection= db.collection(coll);

        collection.updateOne(select, data, (err,r)=>{
            assert.equal(null, err);
            client.close();
            callback()
        })
    })
}

//Remove data from database
function remove(data, callback){
    //TODO
}


module.exports = {
    "insertMany" : insertMany,
    "insertOne" : insertOne,
    "readAll" : readAll,
    "readWithFilter" : readWithFilter,
    "getNextSequenceValue" : getNextSequenceValue,
    "updateOne": updateOne
};