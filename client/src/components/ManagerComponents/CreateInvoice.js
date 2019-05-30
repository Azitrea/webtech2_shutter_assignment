import React from 'react'
import ManagerStorage from "../../storage/ManagerStorage";
import ManagerAction from "../../actions/ManagerAction";

class CreateInvoice extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            id : ManagerStorage._selectedOrder.OrderID,
            invoice: {}
        };

        this.data = {
            id: this.state.id,
            InstallationDate: "",
            paid: "",
            signature: ""
        }

    }

    _onChange() {
        this.setState({id: ManagerStorage._selectedOrder.OrderID});
    }

    componentDidMount() {
        ManagerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        ManagerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row p-3">
                <div className="col-12">

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Order ID:</div>
                        <div className="col-4">
                              <span className="h5">{this.data.id}</span>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">InstallationDate:</div>
                        <div className="col-4">
                            <input className="form-control w-75"
                                onChange={(event) => {
                                    this.data.InstallationDate = event.target.value;
                                    this.setState({invoice: this.data});
                                }}
                                type="date"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">paid:</div>
                        <div className="col-4">
                            <select className="browser-default custom-select w-75"
                                onChange={(event) => {
                                    this.data.paid = event.target.value
                                }}
                            >
                                <option defaultValue={null} label="Choose One"></option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>

                            </select>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Signature:</div>
                        <div className="col-4">
                            <input className="form-control w-75"
                                onChange={(event) => {
                                    this.data.signature = event.target.value;
                                    this.setState({invoice: this.data});
                                }}
                                type="text"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5"></div>
                        <div className="col-2 pt-3">
                            <button
                                onClick={() => {
                                    ManagerAction.createInvoice(this.state.invoice);
                                    console.log(this.state.invoice)
                                }}
                                className="btn btn-success">
                                Create Invoice
                            </button>
                        </div>
                        <div className="col-5"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateInvoice;