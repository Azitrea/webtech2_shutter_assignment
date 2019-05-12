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


//List all customers
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
        }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

});


//List my order IDs
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
        if (!response.ok) {
            throw response.json();
        }
        else {
            return response.json()
        }
    })
        .then(result => {
            CustomerStorage._orderList = result;
        }).then(() => {
        ReactDOM.render(
            React.createElement(CustomerOrders),
            document.getElementById('customerContent')
        );
        CustomerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => {
            console.log(errMsg)
        });
    });
    CustomerStorage.emitChange();
});

//List shutters added to the order
dispatcher.register((data) => {
    if (data.payload.actionType !== 'listMyShutter') {
        return;
    }

    fetch('/customer/order/' + data.payload.payload.customerID + '/myOrders/' + data.payload.payload.shutterID, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        }
        else {
            return response.json()
        }
    })
        .then(result => {
            CustomerStorage._shutterInfo = result;
        }).then(() => {
        ReactDOM.render(
            React.createElement(ShutterInfo),
            document.getElementById('customerContent')
        );
        CustomerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    CustomerStorage.emitChange();
});

//Get One customer
dispatcher.register((data) => {
    if (data.payload.actionType !== 'getCustomerData') {
        return;
    }

    fetch('customer/getOne/' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        }
        else {
            return response.json()
        }
    }).then(result => {
        CustomerStorage._oneCustomer = result;
        CustomerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    CustomerStorage.emitChange();
});

//Add new customer
dispatcher.register((data) => {
    if (data.payload.actionType !== "addNewCustomer") {
        return;
    }

    fetch('/customer/addCustomer', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        }
        else {
            return response.json()
        }
    })
        .then((data) => {
            console.log(data);
            CustomerStorage._selectedCustomer = data.resVal;
        }).then(() => {
        ReactDOM.render(
            React.createElement(SelectedCustomer),
            document.getElementById('shutterContent'))
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

    CustomerStorage.emitChange()
});

//Get shutter types
dispatcher.register((data) => {
    if (data.payload.actionType !== 'getShutterType') {
        return;
    }
    fetch('/customer/list/shutterType', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            CustomerStorage._shutterType = result;
            CustomerStorage.emitChange();
        })
});

//Get Color and material
dispatcher.register((data) => {
    if (data.payload.actionType !== 'getMiscData') {
        return;
    }
    fetch('/customer/list/Misc', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            result.map((data) => {
                return (
                    CustomerStorage._color = data.color,
                        CustomerStorage._material = data.material
                )
            });
            CustomerStorage.emitChange();
        });

});

//Add new order
dispatcher.register((data) => {
    if (data.payload.actionType !== "submitOrder") {
        return;
    }

    fetch('/customer/submitOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        }
        else {
            return response.json()
        }
    })
        .then((data) => {
            console.log(data);
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

    CustomerStorage.emitChange()
});

export default dispatcher;