import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";
import ManagerAction from "../../actions/ManagerAction";

class AllOrders extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {allOrders: []}
    }

    _onChange() {
        this.setState({allOrders: ManagerStorage._allOrders});
    }

    componentDidMount() {
        ManagerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        ManagerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row">
                <div className="col-3 border">
                    <div className="text-center h4 pt-3">All orders</div>
                    <div className="card-body">
                        <ul className="list-group text-center">
                            {
                                this.state.allOrders.map((ready) => {
                                    return (
                                        <li className="list-group-item cursorPointer" key={ready.OrderID} onClick={()=> {
                                            ManagerAction.listCustomerByOrderID(ready);
                                        }}>{ready.OrderID} <br/> {ready.status}</li>
                                    )
                                })}
                        </ul>
                    </div>
                    <div className="card-footer"></div>
                </div>
                <div className="col-9" id="customerData"></div>
            </div>
        )
    }
}

export default AllOrders;