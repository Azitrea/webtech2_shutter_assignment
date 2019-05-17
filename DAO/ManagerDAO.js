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

//Get generated id
function getNextSequenceValue(sequenceName) {
    return new Promise(async resolve => {
        var client = new MongoClient(url);
        await client.connect((err) => {
            assert.equal(null, err);

            const db = client.db(dbName);
            const collection = db.collection("counters");

            collection.updateOne({"_id": sequenceName}, {$inc: {"sequence_value": 1}}, () => {
                resolve(collection.find({"_id": sequenceName}).toArray());
            });
        });
    })
}

//Get next invoice id
async function getNextInvoiceID() {
    const shutterIdData = await getNextSequenceValue("invoiceid");
    return shutterIdData[0]['sequence_value'].toString();
}

//ListCustomerData
function listCustomerData(callback) {
    readAll("customerData", (result) => {
        callback(result)
    })
}

//Set order status
function setOrderStatus(ordID, callback) {
    let select = {"orderIDs.OrderID": ordID};
    let data = {$set: {"orderIDs.$.status": 'Invoice Created'}};

    updateOne("customerData", select, data, (result) => {
        callback()
    })
}

//Get created invoices by id
function getCreatedInvoiceByOrderID(ordID, success, error) {
    readWithFilter('createdInvoices', {"orderID": ordID}, (result) => {
        if (result.length !== 0) {
            success(result)
        } else {
            error('Invoce is not existing')
        }
    })
}

//Get all invoices
function readInvoices(ordID, callback) {
    readWithFilter('createdInvoices', {"orderID": ordID}, (invoiceResult) => {
        callback(invoiceResult);
    })
}

//get shutters by order ID
function getOrderedShuttersList(ordID, callback){
    readWithFilter('orderedShutters', {"orderID": ordID}, (result) =>{
        callback(result)
    });
}

function insertInvoice(invoice, callback){
    insertOne('createdInvoices', invoice, (result) => {
        callback(result)
    })
}

function getShutterTypes(callback){
    readAll("shutterType", (result) => {
        callback(result);
    })
}

function getAllOrderedShutters(callback){
    readAll("orderedShutters", (result) => {
        callback(result)
    })
}

module.exports = {
    "readAll": readAll,
    "readWithFilter": readWithFilter,
    "insertMany": insertMany,
    "insertOne": insertOne,
    "getNextSequenceValue": getNextSequenceValue,
    "updateOne": updateOne,
    "getNextInvoiceID": getNextInvoiceID,
    "listCustomerData": listCustomerData,
    "setOrderStatus": setOrderStatus,
    "getCreatedInvoiceByOrderID": getCreatedInvoiceByOrderID,
    "readInvoices": readInvoices,
    "getOrderedShuttersList": getOrderedShuttersList,
    "inserInvoice": insertInvoice,
    "getShutterTypes": getShutterTypes,
    "getAllOrderedShutters": getAllOrderedShutters
};