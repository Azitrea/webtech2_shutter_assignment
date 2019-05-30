import React from 'react';
import CustomerActions from '../../actions/CustomerActions'
import CustomerStorage from '../../storage/CustomerStorage'


class CustomerList extends React.Component {

    constructor(props) {
        super(props);
        CustomerActions.listCustomers();
        this._onChange = this._onChange.bind(this);
        this.state = {customers: []}
    }

    _onChange() {
        this.setState({customers: CustomerStorage._customers});
    }

    componentDidMount() {
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row pt-1">
                <div className="col-md-4"></div>
                <div className="card col-4 shadow-lg">
                    <div className= "h1 text-center pt-3">Login</div>
                    <div className="card-body">
                        <ul className="list-group">
                            {
                                this.state.customers.map((customer) => {
                                    return (

                                        <li key={customer._id}
                                            className="list-group-item"
                                            onClick={() => {
                                                CustomerActions.renderSelectedCustomer(customer._id);
                                            }}>
                                            Name: {customer.name}<br/>
                                            e-mail: {customer.email}<br/>
                                        </li>)
                                })}
                        </ul>
                    </div>
                    <div></div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default CustomerList;