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
        this.DAO = require('../DAO/WorkerDAO')
    }
}

WorkerService.prototype.listOrderIDs = function(callback){
    this.DAO.listOrderIDs((result) => {
        callback(result)
    })
};

//List all shutters by orderID
WorkerService.prototype.listShutters = function (id, callback) {
    this.DAO.listShutters(id, (result) => {
        callback(result)
    })
};

//Set job status to under construction or finished
WorkerService.prototype.setJobStatus = function(req, success, error){
    var id = req['id'];
    var status = req['status'];
    if (status !== "Under construction" && status !== "Assembling finished"){
        error("Wrong status value. Options: Under construction or Assembling finished")
    } else {
        this.DAO.getShuttersByShID(id, (result) => {
            if(result.length !== 0){
                 this.DAO.updateShutterStatus(id, status, () => {
                    this.updateOrderStatus(result[0]['orderID'], (result) => {
                        logger.info(`Order: ${id}  Status: ${status}`);
                        if (result !== 'No'){
                            this.listOrderIDs((orderIds) => {
                                success({'resText': result, 'resVal': orderIds})
                            });
                        } else {
                            success({'resText': `Order: ${id}  Status: ${status}`});
                        }
                    });
                })
            } else {
                logger.error(`Shutter: ${id} is not existing`);
                error("Shutter is not existing");
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
           this.DAO.updateCustomerOrdStat(result[0]['customerID'], orderID, (result) =>{
               callback(`Order ${orderID} updated status: Ready to Ship`);
               logger.info(`Order ${orderID} updated status: Ready to Ship`);
           })
       }else {
           callback('No');
       }
   })
};

//List all materials required for the Shutter
WorkerService.prototype.getShutterInfo = function(id, success, error) {
    this.DAO.getShuttersByShID(id, (result) => {
        if(result.length !== 0){
            const keys = ['Window', 'color', 'material', 'comment'];
            const shutterPartsAndData = {};
            for (let i in keys) {
                shutterPartsAndData[keys[i]] = result[0][keys[i]];
            }
            this.DAO.getShutterTypeByID(result[0]['shutterType'], (result) => {
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
