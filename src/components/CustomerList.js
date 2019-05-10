import React from 'react';
import CustomerActions from '../actions/CustomerActions'
import CustomerStorage from '../storage/CustomerStorage'

class CustomerList extends React.Component{

    constructor(props){
        super(props);
        CustomerActions.listCustomers();
        this._onChange = this._onChange.bind(this);
        this.state = { customers : [] }
    }

    _onChange(){
        this.setState({customers : CustomerStorage._customers});
    }

    componentDidMount(){
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount(){
        CustomerStorage.removeChangeListener(this._onChange)
    }
    render(){
        return(

            <div className="card">
                <div className="card-header">Customers</div>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            this.state.customers.map((customer)=>{
                                return (

                                    <li key={customer._id}
                                        className="list-group-item"
                                        onClick={() => { CustomerActions.listMyOrders(customer._id)}}>
                                        {customer._id}<br/>
                                        {customer.name}<br/>
                                        {customer.email}<br/>
                                        {customer.adress}<br/>
                                        {customer.phone}<br/>
                                    </li>)
                            })}
                    </ul>
                </div>
                <div className="card-footer"> </div>

            </div>
        )
    }
}

export default CustomerList;