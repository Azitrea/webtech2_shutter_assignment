import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class CustomerActions{

    listCustomers(){
        ShutterDispatcher.handleViewAction({
            actionType: "listCustomers",
            payload : null
        })
    }

    listMyOrders(customerID){
        ShutterDispatcher.handleViewAction({
            actionType: "listMyOrders",
            payload: parseInt(customerID)
        })
    }

    listMyShutter(customerID, shutterID){
        ShutterDispatcher.handleViewAction({
            actionType: "listMyShutter",
            payload: {"customerID": customerID, "shutterID": shutterID}
        })
    }
}

export default new CustomerActions();