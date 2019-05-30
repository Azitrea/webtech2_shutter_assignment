import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";
import ManagerAction from "../../actions/ManagerAction";

class CustomerData extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {oneCustomer: []}
    }

    _onChange() {
        this.setState({oneCustomer: ManagerStorage._oneCustomer});
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
                <div className="text-center h2 pt-3">Customer data for order: {ManagerStorage._selectedOrder.OrderID}</div>
                <div className="border-top card-body">
                    {this.state.oneCustomer !== undefined && this.state.oneCustomer !== null &&
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <span key={this.state.oneCustomer._id} className="list-group-item">
                                    Customer ID: {this.state.oneCustomer._id}<br/>
                                    Customer name: {this.state.oneCustomer.name}<br/>
                                    Customer e-mail: {this.state.oneCustomer.email}<br/>
                                    Customer address: {this.state.oneCustomer.address}<br/>
                                    Customer phone number: {this.state.oneCustomer.phone}<br/>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td className="pt-3">
                                            <button className="btn btn-outline-success" hidden={ManagerStorage._selectedOrder.status === "Invoice Created" ||  ManagerStorage._selectedOrder.status === "Order Accepted"} onClick={() => {
                                                ManagerAction.renderInvoicePanel();
                                            }}
                                            >CreateInvoice
                                            </button>
                                            <button className="btn btn-outline-success" hidden={ManagerStorage._selectedOrder.status === "Ready to Ship" || ManagerStorage._selectedOrder.status === "Order Accepted"} onClick={() => {
                                                ManagerAction.getInvoice(ManagerStorage._selectedOrder.OrderID);
                                            }}
                                            >Show Invoice
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>


                    </table>
                    }
                </div>
                <div className="border-bottom"></div>
            </div>
        )
    }
}

export default CustomerData;