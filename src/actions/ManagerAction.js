import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class ManagerAction {
    listCustomers(){
        ShutterDispatcher.handleViewAction({
            actionType: "listCustomerData",
            payload: null
        })
    }

    listReadyToShip(){
        ShutterDispatcher.handleViewAction({
            actionType: "readyToShip",
            payload: null
        })
    }

    createInvoice(data){
        ShutterDispatcher.handleViewAction({
            actionType: "createInvoice",
            payload: data
        })
    }
}
export default new ManagerAction();