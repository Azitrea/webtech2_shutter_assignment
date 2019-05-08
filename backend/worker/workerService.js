function WorkerService(DAO){

    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    }
    else {
        this.DAO = require('../DAO/DAO')
    }
}

WorkerService.prototype.listOrderIDs = function(callback){
  this.DAO.readAll('customerData', (result) => {
      if (result.length !== 0){
          const activeOrders = [];
          for (let customer of result){
              if (customer['orderIDs'].length !== 0){
                  for (let ids of customer['orderIDs']){
                      if (Object.values(ids)[0] === "Order Accepted"){
                          activeOrders.push(Object.keys(ids)[0]);
                      }
                  }
              }
          }
          callback(activeOrders);
      }else {
          callback('Customer data is empty');
      }

  })
};

//List all shutters by orderID
WorkerService.prototype.listShutters = function (id, callback) {
    this.DAO.readWithFilter("orderedShutters", {"orderID": id}, (requests) => {
        if(requests.length !== 0){
            callback(requests);
        } else {
            callback('Order ID is invalid')
        }
    });
};

//Set job status to under construction or finished
WorkerService.prototype.setJobStatus = function(req, success, error){
    var id = req['id'];
    var status = req['status'];
    if (status !== "Under construction" && status !== "Assembling finished"){
        error("Wrong status value. Options: Under construction or Assembling finished")
    } else {
        this.DAO.readWithFilter("orderedShutters", {'_id': id}, (result) => {
            if(result.length !== 0){
                let select = {'_id': id};
                let data = {$set: {'status': status}};

                this.DAO.updateOne("orderedShutters", select, data, () => {
                    this.updateOrderStatus(result[0]['orderID'], (res) => {
                        success(`Order: ${id}  Status: ${status}`);
                    });

                })
            } else {
                error("Order is not existing");
            }
        })
    }
};

WorkerService.prototype.updateOrderStatus = function (orderID, callback){
   this.listShutters(orderID, (result) => {
       console.log(orderID);
       let finished = false;
       for(let order of result){
           if(order['status'] === 'Assembling finished'){
               finished = true;
           } else {
               finished = false;
           }
       }
       console.log(finished);
       if (finished) {
           let select = {'_id': result[0]['customerID'], ['orderIDs.' + [orderID]] : "Available"};
           let s = 'orderIDs.$[].' + orderID + '.$[ID]';
           console.log(s);
           let data = {$set: { [s] : 'Ready2'}};
           let filter = {arrayFilters: [  { "ID": [orderID] } ], multi: true};

           this.DAO.updateArray("customerData", select, data, filter, (result) => {
                callback()
           })
       }else {
           callback()
       }
   })
}

//List all martials required for the order
WorkerService.prototype.getShutterInfo = function(id, success, error) {
    this.DAO.readWithFilter("orderedShutters", {'_id': id}, (result) => {
        if(result.length !== 0){
            var keys = ['Window', 'color', 'material', 'comment'];
            var shutterPartsAndData = {};
            for (let i in keys) {
                shutterPartsAndData[keys[i]] = result[0][keys[i]];
            }
            this.DAO.readWithFilter("shutterType", {'_id': result[0]['shutterType']}, (result) => {
                if (result.length !== 0){
                    var keys = ['shutterName', 'shutterType'];
                    for (let i in keys) {
                        shutterPartsAndData[keys[i]] = result[0][keys[i]];
                    }
                    shutterPartsAndData['shutterParts'] = result[0]['shutterParts'][0];
                    success(shutterPartsAndData);
                } else {
                    error('Shutter type is not existing');
                }
            })
        } else {
            error('Order is not existing');
        }
    })
};

module.exports = WorkerService;
