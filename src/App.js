import React from 'react';
import './App.scss';
import CustomerList from './components/CustomerList';

function App() {
  return (
    <div className="App container">
        <div className="row">
          <div className="col-5">
              <CustomerList/>
          </div>
          <div className="col-5" id="CustomerOrders">
          </div>
        </div>
    </div>
  );
}

export default App;
