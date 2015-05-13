'use strict'

var express = require('express');
var controller = require('./auth.controller.js');

var router = express.Router();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
module.exports = router;