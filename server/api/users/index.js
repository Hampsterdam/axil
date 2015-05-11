'use strict';

var express = require('express');
var controller = require('./users.controller');

var router = express.Router();

router.get('/', controller.getUsers);
router.get('/:user_id', controller.getUniqueUser);
router.post('/', controller.addUser);
router.get('/:user_id/following', controller.getFollowing);
router.post('/:user_id/following', controller.follow); 
router.delete('/:user_id/following/:friend_id', controller.unfollow);
router.get('/:user_id/followers', controller.getFollowers);
module.exports = router;
