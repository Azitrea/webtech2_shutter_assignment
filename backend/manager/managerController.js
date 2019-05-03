var express = require('express');
var router = express.Router();

var Srs = require('./managerService');
const managerService = new Srs();

router.get('/list/:id', (req, res) => {
    managerService.listAll(req.params['id'], (result) => {
        res.status(200).send(result);
    })
});

module.exports = router;