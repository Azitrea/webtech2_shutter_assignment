var express = require('express');
var router = express.Router();

var Srs = require('../service/CustomerService');
const customerService = new Srs();

//List customer data from database by given databaseName
router.get('/list/customerData', (req, res) => {
    customerService.listCustomerdat( (result) => {
        res.status(200).send(result);
    })
});

//List shutterType from database by given databaseName
router.get('/list/shutterType', (req, res) => {
    customerService.listShutterType((result) => {
        res.status(200).send(result);
    })
});

//List Misc from database by given databaseName
router.get('/list/Misc', (req, res) => {
    customerService.listMisc( (result) => {
        res.status(200).send(result);
    })
});

//Get one user
router.get('/getOne/:id', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === ''){
        res.status(414).send({'err':'Customer ID is not defined'});
        return;
    }

    customerService.customer(req.params['id'], (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(404).send({"err": cause})
    })
});

//List user orders
router.get('/order/:id/myOrders', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === ''){
        res.status(414).send({'err':'Customer ID is not defined'});
        return;
    }

    customerService.myOrders(req.params['id'], (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({"err": cause})
    })
});

//List ordered shutters by order id
router.get('/order/:id/myOrders/:orderid', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === ''){
        res.status(414).send({'err':'Customer ID is not defined'});
        return;
    }
    if (req.params['orderid'] === undefined || req.params['orderid'] === null || req.params['orderid'] === ''){
        res.status(414).send({'err':'Order ID is not defined'});
        return;
    }

    customerService.myShuttersById(req.params['id'],req.params['orderid'], (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({"err": cause});
    })
});

//Add new customer to database
router.post('/addCustomer', (req, res) => {
    if (req.body === undefined){
        res.status(414).send({'err':'Customer data is empty'});
        return;
    }
    if (req.body['name'] === undefined || req.body['name'] === null || req.body['name'] === ''){
        res.status(414).send({'err':'Customer name is not defined'});
        return;
    }
    if (req.body['email'] === undefined || req.body['email'] === null || req.body['email'] === ''){
        res.status(414).send({'err':'Customer email is not defined'});
        return;
    }
    if (req.body['address'] === undefined || req.body['address'] === null || req.body['address'] === ''){
        res.status(414).send({'err':'Customer address is not defined'});
        return;
    }
    if (req.body['phone'] === undefined || req.body['phone'] === null || req.body['phone'] === ''){
        res.status(414).send({'err':'Customer phone number is not defined'});
        return;
    }

    customerService.addCustomer(req.body,
        (id) => {res.status(200).send({"resText":"New customer added to database", "resVal": id})},
        (cause) => {res.status(409).send({"err:":cause})});
});

//Add new order to database
router.post('/submitOrder', (req, res) =>{
    if (req.body === undefined){
        res.status(414).send({'err':'Customer data is empty'});
        return;
    }
    if (req.body['customerID'] === undefined || req.body['customerID'] === null || req.body['customerID'] === ''){
        res.status(414).send({'err':'Customer name is not defined'});
        return;
    }
    if (req.body['orderedShutters'] === undefined || req.body['orderedShutters'] === null || req.body['orderedShutters'].length === 0){
        res.status(414).send({'err': 'Orders list is empty'})
        return;
    }
    customerService.submitOrder(req.body,
        (id) => {res.status(200).send({"resText":"New order added to database", "resVal": id})},
        (cause) => {res.status(409).send({"err:":cause})})
});

module.exports = router;