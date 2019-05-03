function CustomerService(customerDAO){

    if(customerDAO !== undefined && customerDAO !== null){
        this.customerDAO = customerDAO;
    }
    else {
        this.customerDAO = require('../DAO/DAO')
    }
}


CustomerService.prototype.listAll = function(coll ,callback){
    this.customerDAO.readAll(coll,(requests) => {
        callback(requests)
    })
};

CustomerService.prototype.customer = function(id ,callback){
    this.customerDAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        callback(requests)
    })
};

CustomerService.prototype.myOrders = function(id ,callback){
    this.customerDAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        if(requests[0]['orderID'].length !== 0) {
            var orderIDs = requests[0]['orderID'];
            var orderFilterString = [];
            for (let id in orderIDs) {
                orderFilterString.push({"_id": orderIDs[id]});
            }
            this.customerDAO.readWithFilter("orderedShutters", {$or: orderFilterString}, (requests) => {
                callback(requests);
            });
        } else {
            callback(`No orders for this user: ${id}`);
        }
    });
};


CustomerService.prototype.addCustomer = function(customerData, success, error){
    this.customerDAO.readWithFilter("customerData", {"email": customerData['email']}, (result) =>{
        if(result.length === 0) {
            this.customerDAO.getNextSequenceValue('customerid', (generatedID) => {
                customerData['_id'] = generatedID[0]['sequence_value'].toString();

                this.customerDAO.insert("customerData", customerData, () => {
                    success()
                })
            });
        } else {
            error('User whit this e-mail already exists');
        }
    })
};

CustomerService.prototype.addOrder = function(newOrder, success, error){
    this.customerDAO.readWithFilter("customerData", {"_id": newOrder['customerID'] }, (result) => {
        if (result.length !== 0) {
            this.customerDAO.getNextSequenceValue('orderid', (generatedID) => {
                newOrder['_id'] = generatedID[0]['sequence_value'].toString();
                newOrder['status'] = "Order accepted";

                this.customerDAO.insert("orderedShutters", newOrder, () => {
                    if (success) {

                        let select = {'_id': newOrder['customerID']};
                        let data = {$push: {'orderID': newOrder['_id']}};

                        this.customerDAO.updateOne("customerData", select, data, (result) => {
                            success();
                        })
                    }
                })
            })
        } else {
            error("User is not real");
        }
    })
};


module.exports = CustomerService;