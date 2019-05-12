var express = require('express');
var router = express.Router();

var Srs = require('./managerService');
const managerService = new Srs();

//List everything
router.get('/list/:id', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === ''){
        res.status(414).send({'err':'Database name is not defined'});
        return;
    }

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
    if (req.body === undefined){
        res.status(414).send({'err':'Cant create invoice, request body is empty'});
        return;
    }
    if (req.body['id'] === undefined || req.body['id'] === null || req.body['id'] === ''){
        res.status(414).send({'err':'Order ID is not defined'});
        return;
    }
    if (req.body['InstallationDate'] === undefined || req.body['InstallationDate'] === null || req.body['InstallationDate'] === ''){
        res.status(414).send({'err':'Installation date is not defined'});
        return;
    }
    if (req.body['paid'] === undefined || req.body['paid'] === null || req.body['paid'] === ''){
        res.status(414).send({'err':'Paid status is not defined'});
        return;
    }
    if (req.body['signature'] === undefined || req.body['signature'] === null || req.body['signature'] === ''){
        res.status(414).send({'err':' Manager signature is empty'});
        return;
    }

    managerService.createInnvoince(req.body,(result) => {
        res.status(200).send(result);
    })
});

module.exports = router;