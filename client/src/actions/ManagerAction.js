import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class ManagerAction {

    loadManager(){
        ShutterDispatcher.handleViewAction({
            actionType: "loadManagerComponent",
            payload: null
        })
    }

    listCustomers(){
        ShutterDispatcher.handleViewAction({
            actionType: "listCustomerData",
            payload: null
        })
    }

    listCustomerByOrderID(data){
        ShutterDispatcher.handleViewAction({
            actionType: "listCustomerByOrderID",
            payload: data
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

    listAllOrders(){
        ShutterDispatcher.handleViewAction({
            actionType: "listAllOrdersForManager",
            payload: null
        })
    }

    getInvoice(OrderID){
        ShutterDispatcher.handleViewAction({
            actionType: "getInvoice",
            payload: OrderID
        })
    }

    renderInvoicePanel(){
        ShutterDispatcher.handleViewAction({
            actionType: "renderInvoicePanel"
        })
    }

    showChart(){
        ShutterDispatcher.handleViewAction({
            actionType: "showChart"
        })
    }

}
export default new ManagerAction();