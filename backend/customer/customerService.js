function CustomerService(DAO){

    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    }
    else {
        this.DAO = require('../DAO/DAO')
    }
}


CustomerService.prototype.listAll = function(coll ,callback){
    this.DAO.readAll(coll,(requests) => {
        callback(requests)
    })
};

CustomerService.prototype.customer = function(id ,callback){
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        callback(requests)
    })
};

CustomerService.prototype.myOrders = function(id ,callback){
    this.DAO.readWithFilter("customerData", {"_id": id}, (requests) => {
        if(requests[0]['orderID'].length !== 0) {
            var orderIDs = requests[0]['orderID'];
            var orderFilterString = [];
            for (let id in orderIDs) {
                orderFilterString.push({"_id": orderIDs[id]});
            }
            this.DAO.readWithFilter("orderedShutters", {$or: orderFilterString}, (requests) => {
                callback(requests);
            });
        } else {
            callback(`No orders for this user: ${id}`);
        }
    });
};


CustomerService.prototype.addCustomer = function(customerData, success, error){
    this.DAO.readWithFilter("customerData", {"email": customerData['email']}, (result) =>{
        if(result.length === 0) {
            this.DAO.getNextSequenceValue('customerid', (generatedID) => {
                customerData['_id'] = generatedID[0]['sequence_value'].toString();

                this.DAO.insertOne("customerData", customerData, () => {
                    success()
                })
            });
        } else {
            error('User whit this e-mail already exists');
        }
    })
};
//TODO add array of submitted orders to database
CustomerService.prototype.submitOrder = function(newOrder, success, error){
    this.DAO.readWithFilter("customerData", {"_id": newOrder['customerID'] }, (result) => {
        if (result.length !== 0) {
            this.DAO.getNextSequenceValue('orderid', (generatedID) => {
                newOrder['_id'] = generatedID[0]['sequence_value'].toString();
                newOrder['status'] = "Order accepted";

                this.DAO.insertOne("orderedShutters", newOrder, () => {
                    if (success) {

                        let select = {'_id': newOrder['customerID']};
                        let data = {$push: {'orderID': newOrder['_id']}};

                        this.DAO.updateOne("customerData", select, data, (result) => {
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