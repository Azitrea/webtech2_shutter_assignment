import {EventEmitter} from 'events'

class CustomerStorage extends EventEmitter{

    _selectedCustomer = null;
    _customers = [];
    _orderList = [];
    _shutterInfo = [];
    _oneCustomer = [];
    _shutterType = [];
    _color = [];
    _material = [];


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

export default new CustomerStorage();