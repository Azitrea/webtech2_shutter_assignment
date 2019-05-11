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
    }, (cause) => {
        res.status(404).send({"err": cause})
    })
});

//List user orders
router.get('/order/:id/myOrders', (req, res) => {
    customerService.myOrders(req.params['id'], (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({"err": cause})
    })
});

//List ordered shutters by order id
router.get('/order/:id/myOrders/:orderid', (req, res) => {
    customerService.myOrdersById(req.params['id'],req.params['orderid'], (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({"err": cause});
    })
});

//Add new customer to database
router.post('/addCustomer', (req, res) => {
    customerService.addCustomer(req.body,
        (id) => {res.status(200).send({"resText":"New customer added to database", "resVal": id})},
        (cause) => {res.status(409).send({"err:":cause})});
});

//Add new order to database
router.post('/submitOrder', (req, res) =>{
    customerService.submitOrder(req.body,
        (id) => {res.status(200).send({"resText":"New order added to database", "resVal": id})},
        (cause) => {res.status(409).send({"err:":cause})})
});

module.exports = router;