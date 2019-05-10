import React from 'react';
import CustomerStorage from '../../storage/CustomerStorage'


class CustomerList extends React.Component {

    constructor(props) {
        super(props);
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
                <div className="col-4">
                    Customer Data:
                    {this.state.customer.map((customer) => {
                        return (
                              <span key={customer._id}>{customer.name}</span>
                        )
                    })}
                </div>
                <div className="col-4"> </div>
                <div className="col-4"> </div>
            </div>
        )
    }
}

export default CustomerList;