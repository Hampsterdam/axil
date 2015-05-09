'use strict';

var express = require('express');
var controller = require('./media.controller');

var router = express.Router();

router.get('/', controller.getMedia);
router.post('/', controller.addMedia);
// router.get('/filter', controller.getMediaByFilter);
router.get('/:media_id', controller.getUniqueMedia);
router.put('/:media_id/:tag', controller.updateMedia);
router.delete('/:media_id', controller.removeMedia);
router.post('/:media_id', controller.userLike);
router.delete('/:media_id/likes', controller.userUnlike);
router.get('/tags/:tag', controller.getMediaByTag);
router.get('/time/:time', controller.getMediaByTime);
module.exports = router;
