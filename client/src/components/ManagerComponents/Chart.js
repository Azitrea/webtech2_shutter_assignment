import React, {PureComponent} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ManagerStorage from "../../storage/ManagerStorage";


export default class Example extends PureComponent {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {chart: []}
    }

    _onChange() {
        this.setState({chart: ManagerStorage._chart});
    }

    componentDidMount() {
        ManagerStorage.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        ManagerStorage.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <>
                <div className="text-center font-weight-bolder display-4">Most popular shutter types</div>
                <div className="text-center">
                    <BarChart
                        width={800}
                        height={500}
                        data={this.state.chart}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="6 6"/>
                        <XAxis dataKey="shutterName"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="amount" fill="#8884d8"/>
                    </BarChart>
                </div>
            </>
        );
    }
}
