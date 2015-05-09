'use strict'

var express = require('express');
var controller = require('./auth.controller.js');

var router = express.Router();

router.get('/', controller.checkAuthentication);
router.get('/logout', controller.logout);
router.get('/userinfo', controller.getUserInfo);
router.get('/facebook', controller.loginWithFacebook);
router.get('/facebook/callback', controller.loginWithFacebookRedirect);
router.get('/google', controller.loginWithGoogle);
router.get('/google/callback', controller.loginWithGoogleRedirect);

module.exports = router;