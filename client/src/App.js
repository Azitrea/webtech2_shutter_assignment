import React from 'react';
import './App.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faUser, faStroopwafel} from '@fortawesome/free-solid-svg-icons'
import CustomerActions from "./actions/CustomerActions";
import WorkerActions from "./actions/WorkerActions";
import ManagerAction from "./actions/ManagerAction";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(faStroopwafel);

function App() {

    return (
        <>
            <div className="navBar">
                <FontAwesomeIcon className="customIcon" icon={faUser}/>
                <button className="btn-info" onClick={() => CustomerActions.loadCustomers()}>Customer</button>
                <button className="btn-info" onClick={() => WorkerActions.loadWorker()}>Worker</button>
                <button className="btn-info" onClick={() => ManagerAction.loadManager()}>Manager</button>
            </div>
            <div id="shutterContent"> </div>
        </>
    );
}

export default App;
