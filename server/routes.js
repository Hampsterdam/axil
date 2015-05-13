/**
 * Main application routes
 */

'use strict';
var BodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

module.exports = function(app) {
  app.use(BodyParser.json());
  app.use('/api/users', require('./api/users'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/auth', require('./api/auth'));
  
};
