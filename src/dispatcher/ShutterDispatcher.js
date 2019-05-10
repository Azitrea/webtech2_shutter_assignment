import {Dispatcher} from 'flux'
import React from 'react'
import ReactDOM from 'react-dom'

import CustomerStorage from '../storage/CustomerStorage'
import CustomerOrders from '../components/CustomerOrders'
import ShutterInfo from '../components/ShutterInfo'

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
            CustomerStorage._selectedUser = data.payload.payload;
            CustomerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(CustomerOrders),
            document.getElementById('CustomerOrders')
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
            document.getElementById('CustomerOrders')
        );
    });
    CustomerStorage.emitChange();
});


export default dispatcher;