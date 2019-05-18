var express = require('express');
var path = require('path');
var app = express();

const port = 8080;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, './client/build')));


const customerController = require('./controller/CustomerController');
app.use('/customer',customerController);

const workerController = require('./controller/WorkerController');
app.use('/worker',workerController);

const managerController = require('./controller/ManagerController');
app.use('/manager',managerController);

const index = require('./controller/indexController');
app.use('/', index);


app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});