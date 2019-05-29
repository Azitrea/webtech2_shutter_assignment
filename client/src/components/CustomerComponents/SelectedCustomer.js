import React from 'react';
import CustomerStorage from '../../storage/CustomerStorage';
import CustomerActions from '../../actions/CustomerActions';

class CustomerList extends React.Component {

    constructor(props) {
        super(props);
        CustomerActions.getCustomerData(CustomerStorage._selectedCustomer);
        CustomerActions.getShutterType();
        CustomerActions.getMiscData();
        this._onChange = this._onChange.bind(this);
        this.state = {customer: []}
    }

    _onChange() {
        this.setState({customer: CustomerStorage._oneCustomer});
    }

    componentDidMount() {
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row pt-3">
                <div className="col-1"></div>
                <div className="col-5">
                    <div className="border-dark shadow-lg bg-dark text-white">
                        <div>
                            <div className="text-center h1 border p-1">Customer Data<br/></div>
                            {this.state.customer.map((customer) => {
                                return (
                                    <span key={customer._id}>
                                        ID: {customer._id}<br/>
                                        Name: {customer.name}<br/>
                                        email: {customer.email}<br/>
                                        address: {customer.address}<br/>
                                        Phone Number: {customer.phone}<br/>
                                        </span>
                                )
                            })}
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success w-25 p-2" onClick={() => {
                                CustomerActions.listMyOrders(CustomerStorage._selectedCustomer);
                            }}>List Orders
                            </button>
                            <button className="btn btn-info w-25 p-2" onClick={() => {
                                CustomerActions.createOrderComponent()
                            }}>Create Order
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-5" id="customerContent">

                </div>
                <div className="col-1"></div>
            </div>
        )
    }
}

export default CustomerList;