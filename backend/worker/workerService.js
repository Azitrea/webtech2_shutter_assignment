function WorkerService(DAO){

    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    }
    else {
        this.DAO = require('../DAO/DAO')
    }
}

//List all orders
WorkerService.prototype.listAll = function(coll, callback){
    this.DAO.readAll(coll,(requests) => {
        callback(requests)
    })
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

                this.DAO.updateOne("orderedShutters", select, data, (result) => {
                    success(`Order: ${id}  Status: ${status}`);
                })
            } else {
                error("Order is not existing");
            }
        })
    }
};

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
