import React from 'react';
import WorkerStorage from "../../storage/WorkerStorage";
import WorkerActions from "../../actions/WorkerActions";

class Shutters extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {shutters: []}
    }

    _onChange() {
        this.setState({shutters: WorkerStorage._shutters});
    }

    componentDidMount() {
        WorkerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="card-body">
                {
                    this.state.shutters !== undefined && this.state.shutters !== null &&
                    <div>
                        <table className="w-100">
                            <tbody>
                            {this.state.shutters.map((item) => (
                                <tr className="list-group-item" key={item._id}>
                                    <td className="w-100">
                                        <span>ID: {item._id}</span><br/>
                                        <span>Window Size: {item.Window}</span><br/>
                                        <span>Shutter Type: {item.shutterType}</span><br/>
                                        <span>Shutter Color: {item.color}</span><br/>
                                        <span>Shutter Material: {item.material}</span><br/>
                                        <span>Assembling status: {item.status}</span><br/>
                                        <span>Comment: {item.comment}</span><br/>
                                        <span>Price: {item.price}</span><br/>
                                    </td>
                                    <td>
                                        <button disabled={item.status === 'Assembling finished'} className="btn btn-outline-success" onClick={()=>{
                                            WorkerActions.setStatusToUnderConst(item._id);
                                        }}>Select</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        )
    }
}

export default Shutters;