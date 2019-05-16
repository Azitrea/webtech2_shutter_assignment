var express = require('express');
var app = express();

const port = 8080;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const customerController = require('./controller/customerController');
app.use('/customer',customerController);

const workerController = require('./controller/workerController');
app.use('/worker',workerController);

const managerController = require('./controller/managerController');
app.use('/manager',managerController);

//app.use(express.static('public'));

app.get('/', (req, res) => {
   res.send(`Hello`);
});

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});