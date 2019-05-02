function CustomerService(customerDAO){

    if(customerDAO !== undefined && customerDAO !== null){
        this.customerDAO = customerDAO;
    }
    else {
        this.customerDAO = require('../DAO/DAO')
    }
}


CustomerService.prototype.list = function(coll ,callback){
    this.customerDAO.readAll(coll,(requests) => {
        callback(requests)
    })
};

CustomerService.prototype.order = function(id ,callback){
    console.log(id);
    this.customerDAO.readWithFilter("customerData", {"customerID": id}, (requests) => {
        callback(requests)
    })
};

CustomerService.prototype.myOrders = function(id ,callback){
    this.customerDAO.readWithFilter("customerData", {"customerID": id}, (requests) => {
        var orderIDs = requests[0]['orderID'];

        var orderFilterString = [];
        for(let id in orderIDs) {
            orderFilterString.push({"orderID": orderIDs[id]});
        }

        this.customerDAO.readWithFilter("orderedShutters", {$or: orderFilterString}, (requests) => {
            callback(requests);
        });
    });
};


CustomerService.prototype.addCustomer = function(customerData,success, error){
    this.customerDAO.getNextSequenceValue('customerid', (generatedID) =>{
        customerData['customerID'] = generatedID[0]['sequence_value'];
        console.log(customerData);

        this.customerDAO.insert("customerData", customerData, ()=>{success()})
    });

};

CustomerService.prototype.addOrder = function(newOrder, success, error){
  //TODO
};


module.exports = CustomerService;