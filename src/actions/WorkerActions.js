import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class WorkerActions {

    listAvailableOrders(){
        ShutterDispatcher.handleViewAction({
            actionType: "listAvailableOrders",
            payload: null
        })
    }

    listOrderedShutters(id){
        ShutterDispatcher.handleViewAction({
            actionType: "listOrderedShutters",
            payload: parseInt(id)
        })
    }

    setStatusToUnderConst(shutterID){
        ShutterDispatcher.handleViewAction({
            actionType: "setStatusToUnderConst",
            payload: shutterID
        })
    }

    setStatusToFinished(shutterID){
        ShutterDispatcher.handleViewAction({
            actionType: "setStatusToFinished",
            payload: shutterID
        })
    }

    getSelectedShutterParts(shutterID){
        ShutterDispatcher.handleViewAction({
            actionType: "getSelectedShutterParts",
            payload: shutterID
        })
    }

}
export default new WorkerActions();