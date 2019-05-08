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


ManagerService.prototype.listReady = function (callback) {
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
            callback(readyOrders);
        } else {
            callback('Customer data is empty');
        }

    })
};

ManagerService.prototype.getCustomerDataByOrderID = function(ordID, callback){
    this.DAO.readAll('customerData', (result) => {
        if (result.length !== 0) {
            for (let customer of result) {
                if (customer['orderIDs'].length !== 0) {
                    for (let ids of customer['orderIDs']) {
                        if (ids['OrderID'] === ordID) {
                            callback(customer);
                        }
                    }
                }
            }
        } else {
            callback('Customer data is empty');
        }

    })
};

ManagerService.prototype.createInnvoince = function (body, callback) {
    const ordID = body['id'];
    const InstallationDate = body['InstallationDate'];
    const paid = body['paid'];
    const signature = body['signature']
    this.listReady((result) =>{
        if ((result.indexOf(ordID.toString()) > -1)) {
            this.getCustomerDataByOrderID(ordID, (result) => {
                const keys = ['name', 'email', 'adress', 'phone'];
                const invoice = {};
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
                    for (let shutter of result){
                        const finishedShutter = {};
                        finishedShutter['shutterID'] = shutter['_id'];
                        totalPrice += shutter['price'];
                        for(let i in keys){
                            finishedShutter[keys[i]] = shutter[keys[i]]
                        }
                        invoice["shutters"].push(finishedShutter);
                    }
                    invoice['totalPrice'] = totalPrice;
                    invoice['signature'] = signature;
                    callback(invoice);
                })
            })
        } else {
            callback("Order is not ready for shipping")
        }
    })
};


module.exports = ManagerService;