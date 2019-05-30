import React from 'react';
import WorkerStorage from "../../storage/WorkerStorage";
import WorkerActions from "../../actions/WorkerActions";

class Worker extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {}
    }

    _onChange() {
        this.setState({});
    }

    componentDidMount() {
        WorkerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="text-center pt-5">
                <button className="btn btn-outline-info btn-lg shadow-lg" onClick={() => {WorkerActions.loadOrders()}}>Available Orders</button>
            </div>
        )
    }
}

export default Worker;