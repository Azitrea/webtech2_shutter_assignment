import {Dispatcher} from 'flux'
import React from 'react'
import ReactDOM from 'react-dom'

import CustomerStorage from '../storage/CustomerStorage'
import CustomerOrders from '../components/CustomerComponents/CustomerOrders'
import ShutterInfo from '../components/CustomerComponents/ShutterInfo'
import SelectedCustomer from '../components/CustomerComponents/SelectedCustomer'

class ShutterDispatcher extends Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            payload: action
        });
    }
}

const dispatcher = new ShutterDispatcher();

dispatcher.register((data) => {
    if (data.payload.actionType !== 'listCustomers') {
        return;
    }
    fetch('/customer/list/customerData', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            CustomerStorage._customers = result;
            CustomerStorage.emitChange();
        });
});

dispatcher.register((data) => {
    if (data.payload.actionType !== 'listMyOrders') {
        return;
    }

    fetch('/customer/order/' + data.payload.payload + '/myOrders', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log({response});
        return response.json();
    })
        .then(result => {
            CustomerStorage._orderList = result;
            CustomerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(CustomerOrders),
            document.getElementById('shutterContent')
        );
    });
    CustomerStorage.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== 'listMyShutter') {
        return;
    }

    fetch('/customer/order/' + data.payload.payload.customerID + '/myOrders/'+ data.payload.payload.shutterID, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json()
    })
        .then(result => {
            CustomerStorage._shutterInfo = result;
            CustomerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(ShutterInfo),
            document.getElementById('shutterContent')
        );
    });
    CustomerStorage.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== 'getCustomerData') {
        return;
    }

    fetch('customer/getOne/'+ data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json()
    })
        .then(result => {
            CustomerStorage._oneCustomer = result;
            CustomerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(SelectedCustomer),
            document.getElementById('shutterContent')
        );
        CustomerStorage.emitChange();
    });
    CustomerStorage.emitChange();
});

export default dispatcher;