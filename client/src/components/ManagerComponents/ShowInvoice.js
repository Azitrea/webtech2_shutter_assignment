import React from 'react';
import ManagerStorage from "../../storage/ManagerStorage";

class ShowInvoice extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {invoice: [], orders: []}
    }

    _onChange() {
        this.setState({invoice: ManagerStorage._invoices[0], orders: ManagerStorage._invoiceOrders});
    }

    componentDidMount() {
        ManagerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        ManagerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="row">
                {this.state.invoice !== undefined && this.state.invoice !== null &&
                <>
                    <div className="col-2"></div>
                    <div className="col-4 border-left">
                        <div className="h1 text-center border-bottom">Invoice</div>
                        <span>
                        Invoice ID: {this.state.invoice._id}<br/>
                        Order ID: {this.state.invoice.orderID}<br/>
                        Customer ID: {this.state.invoice.customerID}<br/>
                        Name: {this.state.invoice.name}<br/>
                        e-mail: {this.state.invoice.email}<br/>
                        Address: {this.state.invoice.address}<br/>
                        Phone: {this.state.invoice.phone}<br/>
                        Installation Date: {this.state.invoice.InstallationDate}<br/>
                        Paid?: {this.state.invoice.paid}<br/>
                        Total Price: {this.state.invoice.totalPrice}<br/>
                        Signature: {this.state.invoice.signature}<br/>
                    </span>
                    </div>
                    <div className="col-4 border-left">
                        <div className="h1 text-center border-bottom">Ordered Shutter List</div>
                        {
                            this.state.orders.map((shutter) => {
                                return (
                                    <div key={shutter.shutterID} className="border-bottom pb-3">
                                        <span>
                                            Shutter ID: {shutter.shutterID} <br/>
                                            Window Size: {shutter.Window} <br/>
                                            Shutter Type: {shutter.shutterType} <br/>
                                            Window color: {shutter.color} <br/>
                                            Window material: {shutter.material} <br/>
                                            Price: {shutter.price} <br/>
                                            Comment: {shutter.comment} <br/>
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="col-2"></div>
                </>
                }
            </div>
        )
    }
}

export default ShowInvoice;