var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'manager-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


function ManagerService(DAO) {

    if (DAO !== undefined && DAO !== null) {
        this.DAO = DAO;
    } else {
        this.DAO = require('../DAO/ManagerDAO')
    }
}

//List Customers from database
ManagerService.prototype.listCustomerData = function (callback) {
    console.log("hello")
    this.DAO.listCustomerData((result) => {
        callback(result)
    })
};

//List order IDs ready to ship
ManagerService.prototype.listReady = function (success, error) {
    this.DAO.listCustomerData((result) => {
        if (result.length !== 0) {
            const readyOrders = [];
            for (let customer of result) {
                if (customer['orderIDs'].length !== 0) {
                    for (let ids of customer['orderIDs']) {
                        if (ids['status'] === "Ready to Ship") {
                            readyOrders.push(ids);
                        }
                    }
                }
            }
            success(readyOrders);
        } else {
            error('Customer data is empty');
        }

    })
};

//List order IDs ready to ship
ManagerService.prototype.listReadyIDs = function (success, error) {
    this.DAO.listCustomerData((result) => {
        if (result.length !== 0) {
            const readyOrders = [];
            for (let customer of result) {
                if (customer['orderIDs'].length !== 0) {
                    for (let ids of customer['orderIDs']) {
                        if (ids['status'] === "Ready to Ship") {
                            readyOrders.push(ids['OrderID']);
                        }
                    }
                }
            }
            success(readyOrders);
        } else {
            error('Customer data is empty');
        }

    })
};

//List All order ids
ManagerService.prototype.listAllOrders = function (success, error) {
    this.DAO.listCustomerData((result) => {
        if (result.length !== 0) {
            const orders = [];
            for (let customer of result) {
                if (customer['orderIDs'].length !== 0) {
                    for (let ids of customer['orderIDs']) {
                        orders.push(ids);
                    }
                }
            }
            success(orders);
        } else {
            error('Customer data is empty');
        }

    })
};

//Set order status
ManagerService.prototype.setOrderStatus = function (ordID, success, error) {
    this.DAO.setOrderStatus(ordID, (result)=> {
        success(result);
    })
};

//Get customer by order ID
ManagerService.prototype.getCustomerDataByOrderID = function (ordID, success, error) {
    this.DAO.listCustomerData((result) => {
        if (result.length !== 0) {
            for (let customer of result) {
                if (customer['orderIDs'].length !== 0) {
                    for (let ids of customer['orderIDs']) {
                        if (ids['OrderID'] === ordID) {
                            success(customer);
                        }
                    }
                }
            }
        } else {
            error('Customer data is empty');
        }

    })
};

//Creat invoice from customer data
ManagerService.prototype.createInvoice = function (body, success, error) {
    const ordID = body['id'];
    const InstallationDate = body['InstallationDate'];
    const paid = body['paid'];
    const signature = body['signature'];
    this.DAO.readInvoices( ordID,(invoiceResult) => {
        if (invoiceResult.length === 0) {
            this.listReadyIDs((result) => {
                if ((result.indexOf(ordID.toString()) > -1)) {
                    this.getCustomerDataByOrderID(ordID, async (result) => {
                        const keys = ['name', 'email', 'address', 'phone'];
                        const generatedId = await this.DAO.getNextInvoiceID();
                        const invoice = {};
                        invoice['_id'] = generatedId;
                        invoice['orderID'] = ordID;
                        invoice['customerID'] = result['_id'];
                        for (let i in keys) {
                            invoice[keys[i]] = result[keys[i]];
                        }
                        invoice['InstallationDate'] = InstallationDate;
                        invoice['paid'] = paid;
                        invoice["shutters"] = [];
                        let totalPrice = 0;
                        this.DAO.getOrderedShuttersList(ordID ,(result) => {
                            const keys = ['Window', 'shutterType', 'color', 'material', 'price', 'comment'];
                            for (let shutter of result) {
                                const finishedShutter = {};
                                finishedShutter['shutterID'] = shutter['_id'];
                                totalPrice += shutter['price'];
                                for (let i in keys) {
                                    finishedShutter[keys[i]] = shutter[keys[i]]
                                }
                                invoice["shutters"].push(finishedShutter);
                            }
                            invoice['totalPrice'] = totalPrice;
                            invoice['signature'] = signature;
                            this.DAO.inserInvoice(invoice, (result) => {
                                this.setOrderStatus(ordID, (result) => {
                                    logger.info(`Invoice created: ${invoice['_id']}`);
                                    success(invoice);
                                });

                            })
                        })
                    })
                } else {
                    logger.error(`Order is not ready for shipping: ${ordID}`);
                    error("Order is not ready for shipping")
                }
            })
        } else {
            logger.error(`Invoice for this order already exists ${ordID}`);
            error("Invoice for this order already exists");
        }
    });

};


ManagerService.prototype.getInvoice = function (orderID, success, error) {
  this.DAO.getCreatedInvoiceByOrderID(orderID, (result)=> {
      success(result)
  }, (err) => {
      error(err)
  })
};


module.exports = ManagerService;