var express = require('express');
var router = express.Router();

var Srs = require('./managerService');
const managerService = new Srs();

//List everything
router.get('/list/:id', (req, res) => {
    managerService.listAll(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

//List ready to ship orders
router.get('/listReady', (req, res) => {
    managerService.listReady((result) => {
        res.status(200).send(result);
    })
});

//Creat Invoice
router.post('/createInvoice', (req, res) => {
    managerService.createInnvoince(req.body,(result) => {
        res.status(200).send(result);
    })
});

module.exports = router;