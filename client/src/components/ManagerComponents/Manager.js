import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";
import ManagerAction from "../../actions/ManagerAction";

class Manager extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {orders: []}
    }

    _onChange() {
        this.setState({orders: ManagerStorage._orders});
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
                   <div>
                       <button className="w-100 btn btn-outline-success" onClick={()=> {
                           ManagerAction.listCustomers();
                       }}>List customers</button>
                   </div>
                    <div>
                        <button className="w-100 btn btn-outline-success" onClick={()=> {
                           ManagerAction.listAllOrders();
                        }}>All orders</button>
                    </div>
                    <div>
                        <button className="w-100 btn btn-outline-success" onClick={()=> {
                            ManagerAction.listReadyToShip();
                        }}>Orders Ready To Ship</button>
                    </div>
                </div>
                <div className="col-9">
                    <div id="manager"></div>
                </div>
            </div>
        )
    }
}

export default Manager;