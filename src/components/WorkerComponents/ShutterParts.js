import React from 'react';
import WorkerStorage from "../../storage/WorkerStorage";
import WorkerActions from "../../actions/WorkerActions";

class ShutterParts extends React.Component {

    constructor(props) {
        super(props);
        WorkerActions.getSelectedShutterParts(WorkerStorage._selectedShutter);
        this._onChange = this._onChange.bind(this);
        this.state = {shutterInfo: [], shutterParts: []}
    }

    _onChange() {
        this.setState({
            shutterInfo: WorkerStorage._shutterParts,
            shutterParts: WorkerStorage._shutterParts['shutterParts']
        });
    }

    componentDidMount() {
        WorkerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.shutterParts !== undefined && this.state.shutterParts !== null &&
                    <>
                        <div>
                            <span>Name: {this.state.shutterInfo.shutterName}</span><br/>
                            <span>Type: {this.state.shutterInfo.shutterType}</span><br/>
                            <span>Window Size: {this.state.shutterInfo.Window}</span><br/>
                            <span>Color: {this.state.shutterInfo.color}</span><br/>
                            <span>Material: {this.state.shutterInfo.material}</span><br/>
                            <span>Comment: {this.state.shutterInfo.comment}</span><br/>
                        </div>
                        <div>
                            <span>Parts required for assembling</span><br/>
                            <span>Hinges: {this.state.shutterParts.Hinges}</span><br/>
                            <span>Divider rails: {this.state.shutterParts.DividerRails}</span><br/>
                            <span>Lower rails: {this.state.shutterParts.LowerRail}</span><br/>
                            <span>Upper Rails: {this.state.shutterParts.UpperRail}</span><br/>
                            <span>Boards: {this.state.shutterParts.Boards}</span><br/>
                            <span>Wooden sheets: {this.state.shutterParts.Wooden_sheet}</span><br/>

                        </div>
                        <div>
                            <button onClick={() => {
                                WorkerActions.setStatusToFinished(WorkerStorage._selectedShutter);
                            }
                            }>Assembling Finished
                            </button>
                        </div>
                    </>
                    }
                </div>
            </div>
        )
    }
}

export default ShutterParts;