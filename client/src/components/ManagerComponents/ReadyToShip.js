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
                <div className="col-3 border">
                    <div className="h4 text-center pt-3">Orders ready to ship</div>
                    <div className="card-body">
                        <ul className="list-group text-center">
                            {
                                this.state.readyToShip.map((ready) => {
                                    return (
                                        <li className="list-group-item" key={ready.OrderID} onClick={()=> {
                                            ManagerAction.listCustomerByOrderID(ready);
                                        }}>{ready.OrderID}<br/> {ready.status}</li>
                                    )
                                })}
                        </ul>
                    </div>
                    <div></div>
                </div>
                <div className="col-9" id="customerData"></div>
            </div>
        )
    }
}

export default ReadyToShip;