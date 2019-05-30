import React from 'react';
import WorkerActions from "../../actions/WorkerActions";
import WorkerStorage from "../../storage/WorkerStorage";

class ListOrders extends React.Component {
    constructor(props) {
        super(props);
        WorkerActions.listAvailableOrders();
        this._onChange = this._onChange.bind(this);
        this.state = {orders: []}
    }

    _onChange() {
        this.setState({orders: WorkerStorage._orders});
    }

    componentDidMount() {
        WorkerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <>
                <div>
                    <div className="row">
                        <div className="col-6 text-center">
                            <div className="h1">Shutters ready for Assembling</div>
                            <table className="table text-center">
                                <tbody>
                                {this.state.orders.map((orderID) => {
                                    return (
                                        <tr key={orderID}>
                                            <td>{orderID}</td>
                                            <td>
                                                <button className="btn btn-outline-info" onClick={() => {
                                                    WorkerActions.listOrderedShutters(orderID);
                                                }}>List Shutters
                                                </button>
                                            </td>
                                        </tr>

                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6 w-100">
                            <div id="orderedShutterList"></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ListOrders;