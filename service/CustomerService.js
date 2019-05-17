var winston = require('winston');
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'customer-service'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

function CustomerService(DAO) {

    if (DAO !== undefined && DAO !== null) {
        this.DAO = DAO;
    } else {
        this.DAO = require('../DAO/CustomerDAO')
    }
}

//List all data from a database
CustomerService.prototype.listCustomerdat = function (callback) {
    this.DAO.listCustomerData((requests) => {
        callback(requests)
    });
};

//List shutterType from  database
CustomerService.prototype.listShutterType = function (callback) {
    this.DAO.listShutterTypes((requests) => {
        callback(requests)
    });
};

//List Misc from a database
CustomerService.prototype.listMisc = function (callback) {
    this.DAO.listMisc((requests) => {
        callback(requests)
    });
};

//Lists one custome by Id
CustomerService.prototype.customer = function (id, success, error) {
    this.DAO.getOneCustomerByID(id, (result) => {
        success(result);
    }, (err) => {
        error(err);
    });
};

//Lists user ordersIDs by user Id
CustomerService.prototype.myOrders = function (id, success, error) {
    this.DAO.getMyOrders(id, (result) => {
            var orderIDs = result[0]['orderIDs'];
            var orderFilterString = [];
            for (let ids of orderIDs) {
                orderFilterString.push(ids);
            }
            success(orderFilterString);
    }, (err) => {
        error(err);
    });
};

//List all orders for that user by orderId
CustomerService.prototype.myShuttersById = function (id, ordID, success, error) {
    this.DAO.getMyOrders(id, (result) => {
        var orderIDs = result[0]['orderIDs'];
        const idList = [];
        for (let ids of orderIDs) {
            idList.push(ids['OrderID']);
        }
        if ((idList.indexOf(ordID) > -1)) {
            this.DAO.getMyShuttersByID(ordID, (result) => {
                success(result);
            });
        } else {
            error("This is not your order");
        }
    }, (err) => {
        error(err)
    });
};

//Add new customer to database
CustomerService.prototype.addCustomer = function (customerData, success, error) {
    this.DAO.addNewCustomer(customerData, (result) => {
        logger.info(`New customer added to database ${result}`);
        success(result);
    }, (err) => {
        logger.error(err);
        error(err);
    });
};

//Add new orders to orderedshutters database and update the customers orderIDs list
CustomerService.prototype.submitOrder = function (newOrder, success, error) {
    this.DAO.getOneCustomerByID(newOrder['customerID'], async (result) => {
        const orderedShutters = newOrder['orderedShutters'];

        const generatedOrderID = await this.DAO.getNextOrderID();

        this.DAO.getShutterTypes((resultShutter) => {
            this.DAO.getMiscellaneous(async (resultMisc) => {
                for (let i in orderedShutters) {

                    orderedShutters[i]["_id"] = await this.DAO.getNextShutterID();
                    orderedShutters[i]["orderID"] = generatedOrderID;
                    orderedShutters[i]["customerID"] = newOrder["customerID"];
                    orderedShutters[i]["status"] = "Available";
                    orderedShutters[i]["price"] = this.calculatePrice(orderedShutters[i]['shutterType'], orderedShutters[i]['material'], resultMisc, resultShutter);

                }
                this.DAO.insertNewOrders(orderedShutters, newOrder['customerID'], generatedOrderID, (result) => {
                    logger.info(`Order added to database: ${result}`);
                    success(result)
                })
            })
        })
    }, (err) => {
        logger.error(`Customer is not Valid ${newOrder['customerID']}`);
        error(`Customer is not valid: ${newOrder['customerID']}`)
    })
};

//Calculate shutter price
CustomerService.prototype.calculatePrice = function (shutterType, material, materialsFromDB, shutterTypesFormDB) {
    let price = 0;
    for (let sT of shutterTypesFormDB) {
        if (sT['_id'] === shutterType.toString()) {
            price = Number(sT['price']);
            break;
        }

    }
    for (let mat of materialsFromDB[0]['material']) {
        if (mat['_id'] === material) {
            price += Number(mat['price']);
            break;
        }
    }
    return price;

};

module.exports = CustomerService;