import {EventEmitter} from 'events'

class ManagerStorage extends EventEmitter{

    _invoices = [];
    _customers = [];
    _ordersReadyToShip =[];



    emitChange(){
        this.emit('change')
    }

    addChangeListener(callback){
        this.on('change',callback);
    }

    removeChangeListener(callback){
        this.removeListener('change',callback);
    }
}

export default new ManagerStorage();