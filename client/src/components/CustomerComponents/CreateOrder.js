import React from 'react'
import CustomerStorage from '../../storage/CustomerStorage';
import CustomerActions from '../../actions/CustomerActions';

class CreateOrder extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            shutterType: CustomerStorage._shutterType,
            color: CustomerStorage._color,
            material: CustomerStorage._material,
            orders:
                {
                    customerID: CustomerStorage._selectedCustomer,
                    orderedShutters: []
                }

        };

        this.newOrder = {
            WindowWidth: "",
            WindowHeight: "",
            shutterType: "",
            color: "",
            material: "",
            comment: ""
        }

    }

    handleOrders = () => {
        let orders = this.state.orders;

        orders.orderedShutters.push(
            {
                Window: this.newOrder.WindowWidth.toString() + ' X ' + this.newOrder.WindowHeight.toString(),
                shutterType: this.newOrder.shutterType,
                color: this.newOrder.color,
                material: this.newOrder.material,
                comment: this.newOrder.comment
            }
        );

        this.setState({orders});
    };

    _onChange() {
        this.setState({
            shutterType: CustomerStorage._shutterType,
            color: CustomerStorage._color,
            material: CustomerStorage._material
        });
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
                        <div className="col-4 text-center">Window width:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.newOrder.WindowWidth = event.target.value;
                                }}
                                type="number"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Window height:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.newOrder.WindowHeight = event.target.value;
                                }}
                                type="number"/>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Shutter type:</div>
                        <div className="col-4">
                            <select
                                onChange={(event) => {
                                    this.newOrder.shutterType = event.target.value
                                }}
                            >
                                <option defaultValue={null} label="Choose One"></option>
                                {this.state.shutterType.map((type) => {
                                    return (
                                        <option key={type._id} value={type._id}>
                                            {type.shutterName} | Price: ${type.price}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Shutter color:</div>
                        <div className="col-4">
                            <select
                                onChange={(event) => {
                                    this.newOrder.color = event.target.value
                                }}
                            >
                                <option defaultValue={null} label="Choose One"></option>
                                {this.state.color.map((color) => {
                                    return (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Shutter material:</div>
                        <div className="col-4">
                            <select
                                onChange={(event) => {
                                    this.newOrder.material = event.target.value
                                }}
                            >
                                <option defaultValue={null} label="Choose One"></option>
                                {this.state.material.map((material) => {
                                    return (
                                        <option key={material._id} value={material._id}>
                                            {material._id} | +{material.price}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 text-center">Comment:</div>
                        <div className="col-4">
                            <input
                                onChange={(event) => {
                                    this.newOrder.comment = event.target.value;
                                }}
                                type="textfield"/>
                        </div>
                    </div>

                    <div className="row p-2">
                        <div className="col-3"></div>
                        <div className="col-3">
                            <button
                                onClick={() => {
                                    this.handleOrders();
                                }}
                                className="btn btn-success">
                                Add to cart
                            </button>
                        </div>
                        <div className="col-3">
                            <div>
                                <button
                                    onClick={() => {
                                        CustomerActions.submitOrder(this.state.orders);
                                    }}
                                    className="btn btn-success">
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div className="col-3"></div>
                    </div>

                    <div>
                            {this.state.orders.orderedShutters.map((shutters, index) => {
                                return (
                                    <span key={index}>
                                        Window size: {shutters.Window}<br/>
                                        Shutter type: {shutters.shutterType} | Shutter color: {shutters.color} | Shutter material: {shutters.material}<br/>
                                        Comment: {shutters.comment}<br/>
                                    </span>
                                )
                            })}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateOrder;