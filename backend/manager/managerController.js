var express = require('express');
var router = express.Router();

var Srs = require('./managerService');
const managerService = new Srs();


module.exports = router;