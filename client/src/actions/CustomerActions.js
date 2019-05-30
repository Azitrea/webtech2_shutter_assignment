import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class CustomerActions {

    loadCustomers(){
        ShutterDispatcher.handleViewAction({
            actionType: "loadCustomerComponent",
            payload: null
        })
    }

    listCustomers() {
        ShutterDispatcher.handleViewAction({
            actionType: "listCustomers",
            payload: null
        })
    }

    listMyOrders(customerID) {
        ShutterDispatcher.handleViewAction({
            actionType: "listMyOrders",
            payload: parseInt(customerID)
        })
    }

    listMyShutter(customerID, shutterID) {
        ShutterDispatcher.handleViewAction({
            actionType: "listMyShutter",
            payload: {"customerID": customerID, "shutterID": shutterID}
        })
    }

    renderSelectedCustomer(customerID){
        ShutterDispatcher.handleViewAction({
            actionType: "renderSelectedCustomer",
            payload: customerID
            })
    }

    getCustomerData(customerID) {
        ShutterDispatcher.handleViewAction({
            actionType: "getCustomerData",
            payload: parseInt(customerID)
        })
    }

    addCustomer(data) {
        ShutterDispatcher.handleViewAction({
            actionType: "addNewCustomer",
            payload: data
        })
    }

    getShutterType() {
        ShutterDispatcher.handleViewAction({
            actionType: "getShutterType",
            payload: null
        })
    }

    getMiscData() {
        ShutterDispatcher.handleViewAction({
            actionType: "getMiscData",
            payload: null
        })
    }

    submitOrder(data){
        ShutterDispatcher.handleViewAction({
          actionType: "submitOrder",
          payload: data
        })
    }

    createOrderComponent(){
        ShutterDispatcher.handleViewAction({
            actionType: "createOrderComponent",
            payload: null
        })
    }
}

export default new CustomerActions();