import {EventEmitter} from 'events'

class ManagerStorage extends EventEmitter{

    _invoices = [];
    _customers = [];
    _oneCustomer = [];
    _ordersReadyToShip =[];
    _allOrders = [];
    _selectedOrder = null;
    _invoiceOrders = [];



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