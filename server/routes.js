/**
 * Main application routes
 */

'use strict';
var BodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

module.exports = function(app) {
  app.use(BodyParser.json());
  app.use('/api/users', require('./api/users'));
  app.use('/api/media',[multer({ dest: './'})], require('./api/media'));
  app.use('/api/auth', require('./api/auth'));

  // app.route('/')
  //   .get(function(req, res) {
  //     var index = fs.createReadStream(path.resolve(__dirname, '../client/index.html'))
  //     index.pipe(res);
  //   });
  
};
