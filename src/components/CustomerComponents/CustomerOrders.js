import React from 'react';
import CustomerActions from '../../actions/CustomerActions'
import CustomerStorage from '../../storage/CustomerStorage'

class CustomerOrders extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {selectedCustomer: null, orderList: []}
    }

    _onChange() {
        this.setState({selectedCustomer: CustomerStorage._selectedCustomer, orderList: CustomerStorage._orderList});
    }

    componentDidMount() {
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="card">
                <div className="card-header text-black">Orders</div>
                <div className="card-body">
                    {
                        this.state.orderList !== undefined && this.state.orderList !== null &&
                        <div>
                            <ul className="list-group">
                                {this.state.orderList.map((item) => (
                                    <li className="list-group-item" key={item} onClick={() => {
                                        CustomerActions.listMyShutter(this.state.selectedCustomer, item)
                                    }}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default CustomerOrders;