var winston = require('winston')
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'worker-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


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
                      if (ids['status'] === "Order Accepted"){
                          activeOrders.push(ids['OrderID']);

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
                        logger.info(`Order: ${id}  Status: ${status}`);
                        success(`Order: ${id}  Status: ${status}`);
                    });

                })
            } else {
                logger.error(`Order: ${id} is not existing`);
                error("Order is not existing");
            }
        })
    }
};

//Updates the order status when all the shutters are set to Assembling finished
WorkerService.prototype.updateOrderStatus = function (orderID, callback){
   this.listShutters(orderID, (result) => {
       let finished = true;
       for(let order of result){
           if(order['status'] !== 'Assembling finished'){
               finished = false;
           }
       }
       if (finished) {
           let select = {'_id': result[0]['customerID'], "orderIDs.OrderID" : orderID};
           let data = {$set: { "orderIDs.$.status" : 'Ready to Ship'}};

           this.DAO.updateOne("customerData", select, data, (result) => {
               logger.info(`Order ${orderID} updated status: Assembling finished`);
               callback()
           })
       }else {
           callback()
       }
   })
};

//List all materials required for the Shutter
WorkerService.prototype.getShutterInfo = function(id, success, error) {
    this.DAO.readWithFilter("orderedShutters", {'_id': id}, (result) => {
        if(result.length !== 0){
            const keys = ['Window', 'color', 'material', 'comment'];
            const shutterPartsAndData = {};
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
            error(`Shutter with this ShutterID is not existing: ${id}`);
        }
    })
};

module.exports = WorkerService;
