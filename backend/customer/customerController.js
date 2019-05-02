var express = require('express');
var router = express.Router();

var Srs = require('./customerService');
const customerService = new Srs();

//List everything from database by given databaseName , This is temporary
router.get('/list/:id', (req, res) => {
    customerService.list(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//Get one user
router.get('/order/:id', (req, res) => {
    customerService.order(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//List user ordersv
router.get('/order/:id/myOrders', (req, res) => {
    customerService.myOrders(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});
router.post('/submitOrder', (req, res) =>{

});

router.post('/addCustomer', (req, res) => {

});

module.exports = router;