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

//List customerData form collection
function listCustomerData(callback) {
    readAll("customerData", (result) => {
            callback(result)
        }
    )
}

//List shutterTypes form collection
function listShutterTypes(callback) {
    readAll("shutterType", (result) => {
            callback(result)
        }
    )
}

//List listMisc form collection
function listMisc(callback) {
    readAll("Misc", (result) => {
            callback(result)
        }
    )
}

//Get one customer by ID from database
function getOneCustomerByID(id, success, error) {
    readWithFilter("customerData", {"_id": id}, (response) => {
        if (response.length !== 0) {
            success(response)
        } else {
            error('User not found')
        }
    });
}

//Returns order IDs and status
function getMyOrders(id, success, error) {
    readWithFilter("customerData", {"_id": id}, (result) => {
        if (result.length !== 0) {
            if (result[0]['orderIDs'].length !== 0) {
                success(result)
            } else {
                error(`No orders found for this user: ${id}`);
            }
        } else {
            error(`Customer not found: ${id}`);
        }
    })
}

//Returns shutter by order ID
function getMyShuttersByOrdID(ordID, success, error) {
    readWithFilter("orderedShutters", {"orderID": ordID}, (requests) => {
        success(requests);
    })
}

//Add new Customer to database
function addNewCustomer(customerData, success, error) {
    readWithFilter("customerData", {"email": customerData['email']}, async (result) => {
        if (result.length === 0) {
            const generatedCustomerID = await getNextSequenceValue('customerid');

            customerData['_id'] = generatedCustomerID[0]['sequence_value'].toString();
            customerData['orderIDs'] = [];

            insertOne("customerData", customerData, () => {

                success(customerData['_id']);
            })

        } else {
            error(`User whit this e-mail already exists ${customerData['email']}`);
        }
    })
}

//Insert new order
function insertNewOrders(orderedShutters, customerID, orderID, success) {
    insertMany("orderedShutters", orderedShutters, () => {

        const select = {'_id': customerID};
        const data = {
            $push: {
                'orderIDs': {
                    "OrderID": orderID,
                    "status": "Order Accepted"
                }
            }
        };
        updateOne("customerData", select, data, () => {
            success(orderedShutters['OrderID']);
        })

    });
}

//Returns shutter types from database
function getShutterTypes(callback) {
    readAll('shutterType', (result) => {
        callback(result)
    });
}

//Returns misc data from database
function getMiscellaneous(callback) {
    readWithFilter("Misc", {'_id': "miscellaneous"}, (result) => {
        callback(result);
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

//Get generated OrderID
async function getNextOrderID() {
    const orderIdData = await getNextSequenceValue('orderid');
    return orderIdData[0]['sequence_value'].toString();
}

//Get generated ShutterID
async function getNextShutterID() {
    const shutterIdData = await getNextSequenceValue("orderedshutterid");
    return shutterIdData[0]['sequence_value'].toString();
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


module.exports = {
    "readAll": readAll,
    "readWithFilter": readWithFilter,
    "insertMany": insertMany,
    "insertOne": insertOne,
    "getNextSequenceValue": getNextSequenceValue,
    "updateOne": updateOne,
    "getOneCustomerByID": getOneCustomerByID,
    "getMyOrders": getMyOrders,
    "listCustomerData": listCustomerData,
    "listShutterTypes": listShutterTypes,
    "listMisc": listMisc,
    "getMyShuttersByID": getMyShuttersByOrdID,
    "addNewCustomer": addNewCustomer,
    "getNextOrderID": getNextOrderID,
    "getShutterTypes": getShutterTypes,
    "getMiscellaneous": getMiscellaneous,
    "getNextShutterID": getNextShutterID,
    "insertNewOrders": insertNewOrders
};