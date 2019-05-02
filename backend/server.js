var express = require('express');
var app = express();

const port = 8080;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const customerController = require('./customer/customerController')
app.use('/customer',customerController);

//app.use(express.static('public'));

app.get('/', (req, res) => {
   res.send(`Hello`);
});

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});