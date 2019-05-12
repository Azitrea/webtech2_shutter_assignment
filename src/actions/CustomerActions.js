import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class CustomerActions {

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
}

export default new CustomerActions();