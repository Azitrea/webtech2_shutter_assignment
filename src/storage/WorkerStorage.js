import {EventEmitter} from 'events'

class CustomerStorage extends EventEmitter{

    _selectedShutter = null;
    _orders = [];
    _shutters = [];
    _shutterParts = [];

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