import React from 'react'
import CustomerStorage from '../../storage/CustomerStorage';
import CustomerActions from '../../actions/CustomerActions';

class RegisterCustomer extends React.Component {

    constructor(props) {
        super(props);
        // MovieActions.fetchRatings();
        // MovieActions.fetchCategories();
        this._onChange = this._onChange.bind(this);
        this.state = {
            newCustomer: {}
        };

        this.data = {
            name: "",
            email: "",
            address: "",
            phone: ""
        }

    }

    _onChange() {
        this.setState();
    }

    componentDidMount() {
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row p-3">
                <div className="col-12">

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Name:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.data.name = event.target.value;
                                    this.setState({newCustomer: this.data});
                                }}
                                type="text"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">e-mail:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.data.email = event.target.value;
                                    this.setState({newCustomer: this.data});
                                }}
                                type="text"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Address:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.data.address = event.target.value;
                                    this.setState({newCustomer: this.data});
                                }}
                                type="text"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Phone number:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.data.phone = event.target.value;
                                    this.setState({newCustomer: this.data});
                                }}
                                type="text"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5"></div>
                        <div className="col-2">
                            <button
                                onClick={() => {
                                    CustomerActions.addCustomer(this.state.newCustomer);
                                }}
                                className="btn btn-success">
                                Register
                            </button>
                        </div>
                        <div className="col-5"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterCustomer;