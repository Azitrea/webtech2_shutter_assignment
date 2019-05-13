import {Dispatcher} from 'flux'
import React from 'react'
import ReactDOM from 'react-dom'

import CustomerStorage from '../storage/CustomerStorage'
import CustomerOrders from '../components/CustomerComponents/CustomerOrders'
import ShutterInfo from '../components/CustomerComponents/ShutterInfo'
import SelectedCustomer from '../components/CustomerComponents/SelectedCustomer'
import WorkerStorage from "../storage/WorkerStorage";
import Shutters from "../components/WorkerComponents/Shutters";
import CreateOrder from "../components/CustomerComponents/CreateOrder";
import ShutterParts from "../components/WorkerComponents/ShutterParts";
import ManagerStorage from "../storage/ManagerStorage";
import MCustomerList from "../components/ManagerComponents/MCustomerList";
import ReadyToShip from "../components/ManagerComponents/ReadyToShip";
import CustomerData from "../components/ManagerComponents/CustomerData";
import CreateInvoice from "../components/ManagerComponents/CreateInvoice";
import AllOrders from "../components/ManagerComponents/AllOrders";
import ShowInvoice from "../components/ManagerComponents/ShowInvoice";

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
        } else {
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
        } else {
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
        } else {
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

//Render selected customer
dispatcher.register((data) => {
    if (data.payload.actionType !== "renderSelectedCustomer") {
        return;
    }

    CustomerStorage._selectedCustomer = data.payload.payload.toString();
    ReactDOM.render(
        React.createElement(SelectedCustomer),
        document.getElementById('shutterContent')
    );
    CustomerStorage.emitChange();
});

//Render selected customer
dispatcher.register((data) => {
    if (data.payload.actionType !== "createOrderComponent") {
        return;
    }

    ReactDOM.render(
        React.createElement(CreateOrder),
        document.getElementById('customerContent')
    );

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
        } else {
            return response.json()
        }
    })
        .then((data) => {
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

    console.log(data.payload.payload);

    fetch('/customer/submitOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        } else {
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

//Get orders for Worker
dispatcher.register((data) => {
    if (data.payload.actionType !== "listAvailableOrders") {
        return;
    }

    fetch('worker/listOrderIDs', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json()
        }
    }).then(result => {
        WorkerStorage._orders = result;
        WorkerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    WorkerStorage.emitChange();

});

//Get shutters by order id
dispatcher.register((data) => {
    if (data.payload.actionType !== "listOrderedShutters") {
        return;
    }

    fetch('worker/listOrderIDs/' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json()
        }
    }).then(result => {
        console.log(result);
        WorkerStorage._shutters = result;
        WorkerStorage.emitChange();
    }).then(() => {
            ReactDOM.render(
                React.createElement(Shutters),
                document.getElementById('orderedShutterList'));
            WorkerStorage.emitChange();
        }
    ).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    WorkerStorage.emitChange();

});

//set status to Under construction
dispatcher.register((data) => {
    if (data.payload.actionType !== "setStatusToUnderConst") {
        return;
    }

    fetch('/worker/select', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "id": data.payload.payload,
            "status": "Under construction"
        })
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json()
        }
    }).then((result) => {
        WorkerStorage._selectedShutter = data.payload.payload;
        console.log(result);
    }).then(() => {
            ReactDOM.render(
                React.createElement(ShutterParts),
                document.getElementById('orderedShutterList'));
            WorkerStorage.emitChange();
        }
    );

    WorkerStorage.emitChange()
});

//set status to Finished
dispatcher.register((data) => {
    if (data.payload.actionType !== "setStatusToFinished") {
        return;
    }

    fetch('/worker/select', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "id": data.payload.payload,
            "status": "Assembling finished"
        })
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json()
        }
    }).then((data) => {
        WorkerStorage._selectedShutter = null;
        console.log(data);
    }).then(() => {
            ReactDOM.render(<div></div>,
                document.getElementById('orderedShutterList'));
            WorkerStorage.emitChange();
        }
    ).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    WorkerStorage.emitChange()
});

//Get part list for selected shutter
dispatcher.register((data) => {
    if (data.payload.actionType !== "getSelectedShutterParts") {
        return;
    }

    fetch('worker/parts/' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json()
        }
    }).then(result => {
        console.log(result);
        WorkerStorage._shutterParts = result;
        WorkerStorage.emitChange();
    })
    WorkerStorage.emitChange();

});

//List all customers
dispatcher.register((data) => {
    if (data.payload.actionType !== 'listCustomerData') {
        return;
    }
    fetch('/manager/list/customerData', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            ManagerStorage._customers = result;
            ManagerStorage.emitChange();
        }).then(() => {
            ReactDOM.render(
                React.createElement(MCustomerList),
                document.getElementById('manager'));
            ManagerStorage.emitChange();
        }
    ).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

});


//List ready to ship order IDs
dispatcher.register((data) => {
    if (data.payload.actionType !== 'readyToShip') {
        return;
    }
    fetch('/manager/listReady', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            console.log(result)
            ManagerStorage._ordersReadyToShip = result;
            ManagerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(ReadyToShip),
            document.getElementById('manager'));
        ManagerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

});

//List all orders
dispatcher.register((data) => {
    if (data.payload.actionType !== 'listAllOrdersForManager') {
        return;
    }
    fetch('/manager/listAllOrders', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    })
        .then(result => {
            ManagerStorage._allOrders = result;
            ManagerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(AllOrders),
            document.getElementById('manager'));
        ManagerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

});


//List customer by order ID
dispatcher.register((data) => {
    if (data.payload.actionType !== 'listCustomerByOrderID') {
        return;
    }
    const id = data.payload.payload.OrderID;
    console.log(id);
    fetch('/manager/customerByOrderId/'+ id, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json();
        }
    })
        .then(result => {
            ManagerStorage._selectedOrder = data.payload.payload;
            console.log(result)
            ManagerStorage._oneCustomer = result;
            ManagerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(CustomerData),
            document.getElementById('customerData'));
        ManagerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });

});


//create Invoice
dispatcher.register((data) => {
    if (data.payload.actionType !== "createInvoice") {
        return;
    }

    fetch('/manager/createInvoice', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    }).then((response) => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json();
        }
    }).then((data) => {
        console.log(data);
        ManagerStorage._invoices = data;
        ManagerStorage.emitChange();
    }).then(() => {
        ReactDOM.render(
            <div>Invoice Created</div>,
            document.getElementById('manager'));
        ManagerStorage.emitChange();
        }
    ).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    WorkerStorage.emitChange()
});

//Get invoice
dispatcher.register((data) => {
    if (data.payload.actionType !== 'getInvoice') {
        return;
    }

    const id = data.payload.payload;
    console.log(id);
    fetch('/manager/getInvoice/'+ id, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            throw response.json();
        } else {
            return response.json();
        }
    })
        .then(result => {

            ManagerStorage._invoiceOrders = result[0]['shutters'];
            ManagerStorage._invoices = result;
            ManagerStorage.emitChange();
        }).then(() => {
        ReactDOM.render(
            React.createElement(ShowInvoice),
            document.getElementById('manager'));
        ManagerStorage.emitChange();
    }).catch((error) => {
        error.then(errMsg => console.log(errMsg));
    });
    ManagerStorage.emitChange();

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "renderInvoicePanel") {
        return;
    }

    ReactDOM.render(
        React.createElement(CreateInvoice),
        document.getElementById('manager')
    );

    CustomerStorage.emitChange();
});

export default dispatcher;