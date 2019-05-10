import React from 'react';
import CustomerList from "./CustomerList";
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
                        <div className="col-2"> </div>
                        <div className="col-4 bg-danger">
                            <button onClick={() => {this.loadContent(CustomerList)}}>List All Users</button>
                        </div>
                        <div className="col-4 badge-info">
                            <button onClick={() => {this.loadContent(CustomerList)}}>List All Users</button>
                        </div>
                        <div className="col-2"> </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Customers;