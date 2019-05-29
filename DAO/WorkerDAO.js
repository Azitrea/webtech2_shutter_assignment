const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://172.21.0.10:27017';

// Database Name
const dbName = 'shutterAssignment';

//Read from database
function read(coll, findParams, callback) {
    var client = new MongoClient(url);
    client.connect((err) => {
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection = db.collection(coll);

        collection.find(findParams).toArray(function (err, docs) {
            assert.equal(err, null);
            callback(docs)
        });
        client.close();
    })
}

//Read everything
function readAll(coll, callback) {
    read(coll, {}, (result) => {
        callback(result)
    })
}

//Read filtered data
function readWithFilter(coll, filter, callback) {
    read(coll, filter, (result) => {
        callback(result)
    })
}

//InsertOne into doatabase
function insertOne(coll, data, callback) {
    var client = new MongoClient(url);
    client.connect((err) => {
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection = db.collection(coll);

        collection.insertOne(data, (err, r) => {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            client.close();
            callback()
        })
    })
}

//InsertMany into doatabase
function insertMany(coll, data, callback) {
    var client = new MongoClient(url);
    client.connect((err) => {
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection = db.collection(coll);

        collection.insertMany(data, (err, r) => {
            assert.equal(null, err);
            client.close();
            callback()
        })
    })
}

//Update data
function updateOne(coll, select, data, callback) {
    var client = new MongoClient(url);
    client.connect((err) => {
        assert.equal(null, err);

        const db = client.db(dbName);
        const collection = db.collection(coll);

        collection.updateOne(select, data, (err, r) => {
            assert.equal(null, err);
            client.close();
            callback()
        })
    })
}

//List Order IDs
function listOrderIDs(callback){
    readAll('customerData', (result) => {
        if (result.length !== 0){
            const activeOrders = [];
            for (let customer of result){
                if (customer['orderIDs'].length !== 0){
                    for (let ids of customer['orderIDs']){
                        if (ids['status'] === "Order Accepted"){
                            activeOrders.push(ids['OrderID']);

                        }
                    }
                }
            }
            callback(activeOrders);
        }else {
            callback('Customer data is empty');
        }

    })
}

//List all shutters by orderID
function listShutters(id, callback){
    readWithFilter("orderedShutters", {"orderID": id}, (requests) => {
        if(requests.length !== 0){
            callback(requests);
        } else {
            callback('Order ID is invalid')
        }
    });
}

//Update customer to Ready
function updateCustomerOrdStat(customerID, orderID, callback){
    let select = {'_id': customerID, "orderIDs.OrderID" : orderID};
    let data = {$set: { "orderIDs.$.status" : 'Ready to Ship'}};

    updateOne("customerData", select, data, (result) => {
        callback()
    })
}

//List shutters By ShutterID
function getShuttersByShID(id, callback){
    readWithFilter("orderedShutters", {'_id': id}, (result) => {
       callback(result);
    });
}

//Update shutter status to under construction or finished
function updateShutterStatus(id, status, callback){
    let select = {'_id': id};
    let data = {$set: {'status': status}};

    updateOne("orderedShutters", select, data, (result) => {
        callback()
    })
}

function getShutterTypeByID(id, callback){
    readWithFilter("shutterType", {'_id': id}, (result) => {
        callback(result)
    })
}

module.exports = {
    "readAll": readAll,
    "readWithFilter": readWithFilter,
    "insertMany": insertMany,
    "insertOne": insertOne,
    "updateOne": updateOne,
    "listOrderIDs": listOrderIDs,
    "listShutters": listShutters,
    "updateCustomerOrdStat": updateCustomerOrdStat,
    "getShuttersByShID": getShuttersByShID,
    "updateShutterStatus": updateShutterStatus,
    "getShutterTypeByID": getShutterTypeByID
};