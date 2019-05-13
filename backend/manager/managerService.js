function ManagerService(DAO) {

    if (DAO !== undefined && DAO !== null) {
        this.DAO = DAO;
    } else {
        this.DAO = require('../DAO/DAO')
    }
}

ManagerService.prototype.listAll = function (coll, callback) {
    this.DAO.readAll(coll, (requests) => {
        callback(requests)
    })
};

//List order IDs ready to ship
ManagerService.prototype.listReady = function (success, error) {
    this.DAO.readAll('customerData', (result) => {
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
    this.DAO.readAll('customerData', (result) => {
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
    this.DAO.readAll('customerData', (result) => {
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
    let select = {"orderIDs.OrderID": ordID};
    let data = {$set: {"orderIDs.$.status": 'Invoice Created'}};

    this.DAO.updateOne("customerData", select, data, (result) => {
        success()
    })
};

//Get customer by order ID
ManagerService.prototype.getCustomerDataByOrderID = function (ordID, success, error) {
    this.DAO.readAll('customerData', (result) => {
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
ManagerService.prototype.createInvoince = function (body, success, error) {
    const ordID = body['id'];
    const InstallationDate = body['InstallationDate'];
    const paid = body['paid'];
    const signature = body['signature'];
    this.DAO.readWithFilter('createdInvoices', {"orderID": ordID}, (invoiceResult) => {
        if (invoiceResult.length === 0) {
            this.listReadyIDs((result) => {
                if ((result.indexOf(ordID.toString()) > -1)) {
                    this.getCustomerDataByOrderID(ordID, async (result) => {
                        const keys = ['name', 'email', 'address', 'phone'];
                        const generatedId = await this.DAO.getNextSequenceValue('invoiceid');
                        const invoice = {};
                        invoice['_id'] = generatedId[0]['sequence_value'].toString();
                        invoice['orderID'] = ordID;
                        invoice['customerID'] = result['_id'];
                        for (let i in keys) {
                            invoice[keys[i]] = result[keys[i]];
                        }
                        invoice['InstallationDate'] = InstallationDate;
                        invoice['paid'] = paid;
                        invoice["shutters"] = [];
                        let totalPrice = 0;
                        this.DAO.readWithFilter('orderedShutters', {"orderID": ordID}, (result) => {
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
                            this.DAO.insertOne('createdInvoices', invoice, (result) => {
                                this.setOrderStatus(ordID, (result) => {
                                    success(invoice);
                                });

                            })
                        })
                    })
                } else {
                    error("Order is not ready for shipping")
                }
            })
        } else {
            error("Invoice for this order already exists");
        }
    });

};


ManagerService.prototype.getInvoince = function (orderID, success, error) {
  this.DAO.readWithFilter('createdInvoices', {"orderID": orderID}, (result) => {
      if (result.length !== 0){
          success(result)
      }else {
          error('Invoce is not existing')
      }
  })
};


module.exports = ManagerService;