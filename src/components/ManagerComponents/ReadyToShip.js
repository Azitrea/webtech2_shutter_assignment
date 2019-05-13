import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";
import ManagerAction from "../../actions/ManagerAction";

class ReadyToShip extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {readyToShip: []}
    }

    _onChange() {
        this.setState({readyToShip: ManagerStorage._ordersReadyToShip});
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
                <div className="col-3">
                    <div className="card-header">Orders ready to ship</div>
                    <div className="card-body">
                        <ul className="list-group">
                            {
                                this.state.readyToShip.map((ready) => {
                                    return (
                                        <li className="list-group-item" key={ready.OrderID} onClick={()=> {
                                            ManagerAction.listCustomerByOrderID(ready);
                                        }}>{ready.OrderID} | {ready.status}</li>
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

export default ReadyToShip;