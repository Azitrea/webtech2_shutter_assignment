import React from 'react';
import CustomerStorage from '../../storage/CustomerStorage';
import CustomerActions from '../../actions/CustomerActions';


class CustomerList extends React.Component {

    constructor(props) {
        super(props);
        CustomerActions.getCustomerData(CustomerStorage._selectedCustomer);
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
            <div className="row">
                <div className="col-1"></div>
                <div className="col-5">
                    <div>
                        <div>
                            Customer Data: <br/>
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
                        <div>Button1</div>
                        <div>Button2</div>
                    </div>
                </div>
                <div className="col-5 badge-dark" id="customerContent">

                </div>
                <div className="col-1"></div>
            </div>
        )
    }
}

export default CustomerList;