import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";

class MCustomerList extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {customers: []}
    }

    _onChange() {
        this.setState({customers: ManagerStorage._customers});
    }

    componentDidMount() {
        ManagerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        ManagerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div>
                    <div className="card-header">Login</div>
                    <div className="card-body">
                        <ul className="list-group">
                            {
                                this.state.customers.map((customer) => {
                                    return (

                                        <li key={customer._id}
                                            className="list-group-item">
                                            Customer ID: {customer._id}<br/>
                                            Customer name: {customer.name}<br/>
                                            Customer e-mail: {customer.email}<br/>
                                            Customer address: {customer.address}<br/>
                                            Customer phone number: {customer.phone}<br/>
                                        </li>)
                                })}
                        </ul>
                    </div>
                    <div className="card-footer"></div>
            </div>
        )
    }
}

export default MCustomerList;