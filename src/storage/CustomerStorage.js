import {EventEmitter} from 'events'

class CustomerStorage extends EventEmitter{

    _selectedUser = null;
    _customers = [];
    _orderList = [];
    _shutterInfo = [];
    _oneCustomer = [];


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