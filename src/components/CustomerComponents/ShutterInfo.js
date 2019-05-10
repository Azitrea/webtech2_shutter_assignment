import React from 'react';
import CustomerStorage from '../../storage/CustomerStorage'

class CustomerOrders extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {shutterInfo: []}
    }

    _onChange() {
        this.setState({shutterInfo: CustomerStorage._shutterInfo});
    }

    componentDidMount() {
        CustomerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="card-body">
                {
                    this.state.shutterInfo !== undefined &&
                    <div>
                        <ul className="list-group">
                            {this.state.shutterInfo.map((item) =>(
                                <li className="list-group-item" key={item._id}>
                                    <span>ID: {item._id}</span><br/>
                                    <span>Window Size: {item.Window}</span><br/>
                                    <span>Shutter Type: {item.shutterType}</span><br/>
                                    <span>Shutter Material: {item.material}</span><br/>
                                    <span>Comment: {item.comment}</span><br/>
                                    <span>Price: {item.price}</span><br/>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            </div>
        )
    }
}

export default CustomerOrders;