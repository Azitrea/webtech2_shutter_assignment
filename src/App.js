import React from 'react';
import './App.scss';
import Customers from './components/CustomerComponents/Customers';
import Worker from './components/WorkerComponents/Worker'
import Manager from './components/ManagerComponents/Manager'
import ReactDOM from "react-dom";

function App() {

    function loadContent(contentToLoad) {
        ReactDOM.render(
            React.createElement(contentToLoad),
            document.getElementById('shutterContent')
        );
    }


    return (
        <>
            <div className="bg-dark">
                <button className="btn-info" onClick={() => loadContent(Customers)}>Customer</button>
                <button className="btn-info" onClick={() => loadContent(Worker)}>Worker</button>
                <button className="btn-info" onClick={() => loadContent(Manager)}>Manager</button>
            </div>
            <div id="shutterContent"> </div>
        </>


    );
}

export default App;
