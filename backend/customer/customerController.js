var express = require('express');
var router = express.Router();

var Srs = require('./customerService');
const customerService = new Srs();

//List everything from database by given databaseName
router.get('/list/:id', (req, res) => {
    customerService.listAll(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//Get one user
router.get('/getOne/:id', (req, res) => {
    customerService.customer(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//List user orders
router.get('/order/:id/myOrders', (req, res) => {
    customerService.myOrders(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//List ordered shutters by order id
router.get('/order/:id/myOrders/:orderid', (req, res) => {
    customerService.myOrdersById(req.params['id'],req.params['orderid'], (result) => {
        res.status(200).send(result);
    })
});

//Add new customer to database
router.post('/addCustomer', (req, res) => {
    customerService.addCustomer(req.body,
        (id) => {res.status(200).send(`New user added to database. ID: ${id}`)},
        (cause) => {res.status(400).send(cause)})
});

//Add new order to database
router.post('/submitOrder', (req, res) =>{
    customerService.submitOrder(req.body,
        (id) => {res.status(200).send(`New order added to database. Order ID: ${id}`)},
        (cause) => {res.status(400).send(cause)})
});

module.exports = router;