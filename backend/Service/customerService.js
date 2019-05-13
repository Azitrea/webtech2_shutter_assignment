var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'customer-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

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
CustomerService.prototype.customer = function (id, success, error) {
    this.DAO.readWithFilter("customerData", {"_id": id}, (response) => {
        if(response.length !== 0){
            success(response)
        } else {
            error('User not found')
        }
    })
};

//Lists user ordersIDs by user Id
CustomerService.prototype.myOrders = function (id, success, error) {
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        if (requests.length !== 0) {
            if (requests[0]['orderIDs'].length !== 0) {
                var orderIDs = requests[0]['orderIDs'];
                var orderFilterString = [];
                for (let ids of orderIDs) {
                    orderFilterString.push(ids);
                }
                success(orderFilterString);

            } else {
                error(`No orders found for this user: ${id}`);
            }
        } else {
            error(`Customer not found: ${id}`);
        }
    });
};

//List all orders for that user by orderId
CustomerService.prototype.myOrdersById = function (id, orID, success, error) {
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
                        success(requests);
                    });
                } else {
                    error("This is not your order");
                }
            } else {
                error(`No orders found for this user: ${id}`);
            }
        } else {
            error(`Customer not found: ${id}`);
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
                logger.info(`New customer added to database ${customerData['_id']}`);
                success(customerData['_id']);
            })

        } else {
            logger.error(`User whit this e-mail already exists customerData['email']`);
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
                this.DAO.readWithFilter("Misc", {'_id': "miscellaneous"}, async (resultMisc) => {
                    for (let i in orderedShutters) {
                        const generatedShutterID = await this.DAO.getNextSequenceValue('orderedshutterid');

                        orderedShutters[i]["_id"] = generatedShutterID[0]['sequence_value'].toString();
                        orderedShutters[i]["orderID"] = generatedOrderID;
                        orderedShutters[i]["customerID"] = newOrder["customerID"];
                        orderedShutters[i]["status"] = "Available";
                        orderedShutters[i]["price"] = this.calculatePrice(orderedShutters[i]['shutterType'], orderedShutters[i]['material'], resultMisc, resultShutter);
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
                                logger.info(`New order added to database: ${generatedOrderID}`);
                                success(generatedOrderID);
                            })
                        }
                    });
                })
            })

        } else {
            logger.error(`User is not Valid ${newOrder['customerID']}`);
            error('User is not valid');
        }
    })
};

CustomerService.prototype.calculatePrice = function (shutterType, material, materialsFromDB, shutterTypesFormDB) {
    let price = 0;
    for (let sT of shutterTypesFormDB){
        if (sT['_id'] === shutterType.toString()){
            price = Number(sT['price']);
            break;
        }

    }
    for (let mat of materialsFromDB[0]['material']){
        if (mat['_id'] === material){
            price += Number(mat['price']);
            break;
        }
    }
    return price;

};

module.exports = CustomerService;