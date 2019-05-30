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
            <div className="border text-center pr-2">
                <div className="h1 pt-2">Customer List</div>
                <div>


                    <table className="table w-100 table-striped">
                        <tbody>
                        <tr className="h5">
                            <td>ID</td>
                            <td>Name</td>
                            <td>e-mail</td>
                            <td>Address</td>
                            <td>Phone number</td>
                        </tr>
                        {
                            this.state.customers.map((customer) => {
                                    return (

                                        <tr key={customer._id}>
                                            <td>{customer._id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.address}</td>
                                            <td>{customer.phone}</td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default MCustomerList;