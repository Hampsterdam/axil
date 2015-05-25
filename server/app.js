/**
 * Main application file
 */

'use strict';
process.env.NODE_ENV = 'development';

// Load the dependencies
var express = require('express');

var app = express();
var server = require('http').createServer(app);
var pg = require('pg');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwtSecret = 'mysecret';

// CORS Middleware Allowing Cross-Origin Request from the Mobile Application
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    next();
});

// Protect .../api routes with JWT
app.use(bodyParser.json());
// app.use('/api', expressJwt({secret: jwtSecret }).unless({ path: ['/api/auth/login', '/api/auth/signup']}));

// Setup and Initialize socket.io
var io = require('socket.io')(server);
app.use(function(req, res, next){
  req.socket = io;
  next();
})
io.on('connection', function(socket){
  console.log('socket connection');
})

//connect to the router
require('./routes')(app);

// Start server on port 9000
server.listen(process.env.PORT || 9000, function () {
  console.log('Express server listening on PORT 9000');
});

// Expose app
module.exports = app;
