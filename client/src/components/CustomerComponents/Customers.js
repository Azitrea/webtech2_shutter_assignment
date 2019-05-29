import React from 'react';
import CustomerList from "./CustomerList";
import RegisterCustomer from './RegisterCustomer'
import ReactDOM from "react-dom";

class Customers extends React.Component {

    loadContent(contentToLoad) {
        ReactDOM.render(
            React.createElement(contentToLoad),
            document.getElementById('shutterContent')
        );
    }

    render() {
        return (
            <div className="App container">
                <div id="CustomerContent">
                    <div className="row">
                        <div className="col-4"> </div>
                        <div className="p-5 col-4">
                            <div className="p-3">
                                <button className="w-100 btn btn-outline-info btn-lg shadow-lg" onClick={() => {this.loadContent(CustomerList)}}>List All Users</button>
                            </div>
                            <div className="p-3">
                                <button className="w-100 btn btn-outline-success btn-lg shadow-lg" onClick={() => {this.loadContent(RegisterCustomer)}}>Add new user</button>
                            </div>
                        </div>
                        <div className="col-4"> </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Customers;