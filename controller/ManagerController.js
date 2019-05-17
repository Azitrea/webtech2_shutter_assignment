var express = require('express');
var router = express.Router();

var Srs = require('../service/ManagerService');
const managerService = new Srs();

//List everything
router.get('/list/customerData', (req, res) => {
    managerService.listCustomerData((result) => {
        res.status(200).send(result);
    })
});

//List ready to ship orders
router.get('/listReady', (req, res) => {
    managerService.listReady((result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({'err': cause});
    })
});

//List all orders
router.get('/listAllOrders', (req, res) => {
    managerService.listAllOrders((result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(400).send({'err': cause});
    })
});


//Get customer by order ID
router.get('/customerByOrderId/:id', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === '') {
        res.status(414).send({'err': 'Order id is not defined'});
        return;
    }
    managerService.getCustomerDataByOrderID(req.params['id'], (result) => {
            res.status(200).send(result)
        },
        (cause) => {
            res.status(400).send({'err': cause});
        })
});

//Creat Invoice
router.post('/createInvoice', (req, res) => {
    if (req.body === undefined) {
        res.status(414).send({'err': 'Cant create invoice, request body is empty'});
        return;
    }
    if (req.body['id'] === undefined || req.body['id'] === null || req.body['id'] === '') {
        res.status(414).send({'err': 'Order ID is not defined'});
        return;
    }
    if (req.body['InstallationDate'] === undefined || req.body['InstallationDate'] === null || req.body['InstallationDate'] === '') {
        res.status(414).send({'err': 'Installation date is not defined'});
        return;
    }
    if (req.body['paid'] === undefined || req.body['paid'] === null || req.body['paid'] === '') {
        res.status(414).send({'err': 'Paid status is not defined'});
        return;
    }
    if (req.body['signature'] === undefined || req.body['signature'] === null || req.body['signature'] === '') {
        res.status(414).send({'err': ' Manager signature is empty'});
        return;
    }

    managerService.createInvoice(req.body, (result) => {
        res.status(200).send(result);
    }, (cause) => {
        res.status(409).send({'err': cause});
    })
});

//Returns one invoice by order ID
router.get('/getInvoice/:orderID', (req,res) => {
    if (req.params['orderID'] === undefined || req.params['orderID'] === null || req.params['orderID'] === '') {
        res.status(414).send({'err': 'Order id is not defined'});
        return;
    }
    managerService.getInvoice(req.params['orderID'], (result) => {
        res.status(200).send(result)
    }, (cause) => {
        res.status(404).send({"err": cause});
    })
});


//Returns data for chart
router.get('/chart', (req, res) => {
    managerService.getShutterTypeNumbers((result) => {
        res.status(200).send(result);
    })
});
module.exports = router;