var express = require('express');
var router = express.Router();

var Srs = require('../service/WorkerService');
const workerService = new Srs();

//List orders available for assembling
router.get('/listOrderIDs', (req, res) => {
   workerService.listOrderIDs((result) => {
      res.status(200).send(result);
   });
});

//List all shutters in the order
router.get('/listOrderIDs/:id', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === "null" || req.params['id'] === ''){
        res.status(414).send({'err':'Order ID is not defined'});
        return;
    }

    workerService.listShutters(req.params['id'],(result) => {
        res.status(200).send(result);
    });
});

//SetJobStatus
router.post('/select', (req, res) => {
    if (req.body === undefined || req.body === null || req.body === ''){
        res.status(414).send({'err': 'Set status data is empty'});
        return;
    }
    if (req.body['id'] === undefined || req.body['id'] === null || req.body['id'] === ''){
        res.status(414).send({'err': 'Shutter ID is not defined'});
        return;
    }
    if (req.body['status'] === undefined || req.body['status'] === null || req.body['status'] === ''){
        res.status(414).send({'err': 'Assembling status is not defined'});
        return;
    }


    workerService.setJobStatus(req.body, (result) => {
        res.status(200).send({"response":result});
    }, (error) => {
        res.status(400).send({"err:":error});
    });
});

//List all parts required for the shutter
router.get('/parts/:id', (req, res) => {
    if (req.params['id'] === undefined || req.params['id'] === null || req.params['id'] === ''){
        res.status(414).send({'err':'Shutter ID is not defined'});
        return;
    }

    workerService.getShutterInfo(req.params['id'], (result) => {
        res.status(200).send(result);
    }, (error) => {
        res.status(400).send({"err:":error});
    });
});

module.exports = router;