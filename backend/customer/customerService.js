function CustomerService(DAO) {

    if (DAO !== undefined && DAO !== null) {
        this.DAO = DAO;
    } else {
        this.DAO = require('../DAO/DAO')
    }
}

//List all data from a database
CustomerService.prototype.listAll = function (coll, callback) {
    this.DAO.readAll(coll, (requests) => {
        callback(requests)
    })
};

//Lists one custome by Id
CustomerService.prototype.customer = function (id, callback) {
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        callback(requests)
    })
};

//Lists user ordersIDs by user Id
CustomerService.prototype.myOrders = function (id, callback) {
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        if (requests.length !== 0) {
            if (requests[0]['orderIDs'].length !== 0) {
                var orderIDs = requests[0]['orderIDs'];
                var orderFilterString = [];
                for (let ids of orderIDs) {
                    orderFilterString.push(ids['OrderID']);
                }
                callback(orderFilterString);

            } else {
                callback(`No orders found for this user: ${id}`);
            }
        } else {
            callback(`Customer not found: ${id}`);
        }
    });
};

//List all orders for that user by orderId
CustomerService.prototype.myOrdersById = function (id, orID, callback) {
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        if (requests.length !== 0) {
            if (requests[0]['orderIDs'].length !== 0) {
                var orderIDs = requests[0]['orderIDs'];
                const idList = [];
                for (let ids of orderIDs) {
                    idList.push(ids['OrderID']);
                }
                if ((idList.indexOf(orID) > -1)) {
                    this.DAO.readWithFilter("orderedShutters", {"orderID": orID}, (requests) => {
                        callback(requests);
                    });
                } else {
                    callback("This is not your order");
                }
            } else {
                callback(`No orders found for this user: ${id}`);
            }
        } else {
            callback(`Customer not found: ${id}`);
        }
    });
};

//Add new customer to database
CustomerService.prototype.addCustomer = function (customerData, success, error) {
    this.DAO.readWithFilter("customerData", {"email": customerData['email']}, async (result) => {
        if (result.length === 0) {
            const generatedCustomerID = await this.DAO.getNextSequenceValue('customerid');

            customerData['_id'] = generatedCustomerID[0]['sequence_value'].toString();
            customerData['orderIDs'] = [];

            this.DAO.insertOne("customerData", customerData, () => {
                success(customerData['_id']);
            })

        } else {
            error('User whit this e-mail already exists');
        }
    })
};


//Add new orders to orderedshutters database and update the customers orderIDs list
CustomerService.prototype.submitOrder = function (newOrder, success, error) {
    this.DAO.readWithFilter("customerData", {"_id": newOrder['customerID']}, async (result) => {
        if (result.length !== 0) {
            const orderedShutters = newOrder['orderedShutters'];

            const getNextSequenceValueResult = await this.DAO.getNextSequenceValue('orderid');
            const generatedOrderID = getNextSequenceValueResult[0]['sequence_value'].toString();

            this.DAO.readAll('shutterType', (resultShutter) => {
                this.DAO.readWithFilter("Misc", {'_id': "material"}, async (resultMisc) => {
                    for (let i in orderedShutters) {
                        const generatedShutterID = await this.DAO.getNextSequenceValue('orderedshutterid');

                        orderedShutters[i]["_id"] = generatedShutterID[0]['sequence_value'].toString();
                        orderedShutters[i]["orderID"] = generatedOrderID;
                        orderedShutters[i]["customerID"] = newOrder["customerID"];
                        orderedShutters[i]["status"] = "Available";
                        orderedShutters[i]["price"] = this.calculatePrice(orderedShutters[i]['shutterType'], orderedShutters[i]['material'], resultMisc, resultShutter)
                    }
                    this.DAO.insertMany("orderedShutters", orderedShutters, () => {
                        if (success) {

                            const select = {'_id': newOrder['customerID']};
                            const data = {
                                $push: {
                                    'orderIDs': {
                                        "OrderID": generatedOrderID,
                                        "status": "Order Accepted"
                                    }
                                }
                            };

                            this.DAO.updateOne("customerData", select, data, () => {
                                success(generatedOrderID);
                            })
                        }
                    });
                })
            })

        } else {
            error('User is not valid');
        }
    })
};

CustomerService.prototype.calculatePrice = function (shutterType, material, materialsFromDB, shutterTypesFormDB) {
    let price = 0;
    for (let sT of shutterTypesFormDB){
        if (sT['_id'] === shutterType.toString()){
            price = Number(sT['price']) + Number(materialsFromDB[0]['value'][material]);
            break;
        }
    }
    return price;

};

module.exports = CustomerService;