var express = require('express');
var router = express.Router();

var Srs = require('./workerService');
const workerService = new Srs();

//List orders available for assembling
router.get('/listOrderIDs', (req, res) => {
   workerService.listOrderIDs((result) => {
      res.status(200).send(result);
   });
});

//List all shutters in the order
router.get('/listOrderIDs/:id', (req, res) => {
    workerService.listShutters(req.params['id'],(result) => {
        res.status(200).send(result);
    });
});

//SetJobStatus
router.post('/select', (req, res) => {
    if (req.body === undefined || req.body === ''){
        res.send('request is empty');
    }
    workerService.setJobStatus(req.body, (result) => {
        res.status(200).send(result);
    }, (error) => {
        res.status(400).send(error);
    });
});

//List all parts required for the shutter
router.get('/parts/:id', (req, res) => {
    workerService.getShutterInfo(req.params['id'], (result) => {
        res.status(200).send(result);
    }, (error) => {
        res.status(400).send(error);
    });
});

module.exports = router;