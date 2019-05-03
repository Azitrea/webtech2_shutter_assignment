function ManagerService(DAO){

    if(DAO !== undefined && DAO !== null){
        this.DAO = DAO;
    }
    else {
        this.DAO = require('../DAO/DAO')
    }
}

ManagerService.prototype.listAll = function(coll ,callback){
    this.DAO.readAll(coll,(requests) => {
        callback(requests)
    })
};


module.exports = ManagerService;