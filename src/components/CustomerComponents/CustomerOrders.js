import React from 'react';
import CustomerActions from '../../actions/CustomerActions'
import CustomerStorage from '../../storage/CustomerStorage'

class CustomerOrders extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {selectedUser: null, orderList: []}
    }

    _onChange() {
        this.setState({selectedUser: CustomerStorage._selectedUser, orderList: CustomerStorage._orderList});
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
                <div className="card-header">Customers</div>
                <div className="card-body">
                    {
                        this.state.orderList !== undefined &&
                        <div>
                            {this.state.selectedUser}
                            <ul className="list-group">
                                {this.state.orderList.map((item) => (
                                    <li className="list-group-item" key={item} onClick={() => {
                                        CustomerActions.listMyShutter(this.state.selectedUser, item)
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