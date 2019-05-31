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
        this.setState({customer: CustomerStorage._oneCustomer[0]});
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
                {
                    this.state.customer !== undefined && this.state.customer !== null &&
                    <div className="col-5">
                        <div className="border">
                            <div>
                                <div className="text-center h1 p-1">Customer Data<br/></div>
                                <table className="table">
                                    <tbody>
                                    <>
                                        <tr>
                                            <td>ID:</td>
                                            <td>{this.state.customer._id}</td>
                                        </tr>
                                        <tr>
                                            <td>Name:</td>
                                            <td>{this.state.customer.name}</td>
                                        </tr>
                                        <tr>
                                            <td>e-mail:</td>
                                            <td>{this.state.customer.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Address:</td>
                                            <td>{this.state.customer.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone:</td>
                                            <td>{this.state.customer.phone}</td>
                                        </tr>
                                    </>
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-center">
                            <span className="p-2">
                                <button className="btn btn-success w-25" onClick={() => {
                                    CustomerActions.listMyOrders(CustomerStorage._selectedCustomer);
                                }}>List Orders
                                </button>
                            </span>
                                <span className="p-2">
                                <button className="btn btn-info w-25" onClick={() => {
                                    CustomerActions.createOrderComponent()
                                }}>Create Order
                                </button>
                            </span>
                            </div>
                        </div>
                    </div>
                }
                <div className="col-5" id="customerContent">

                </div>
                <div className="col-1"></div>
            </div>
        )
    }
}

export default CustomerList;