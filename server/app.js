/**
 * Main application file
 */

'use strict';
process.env.NODE_ENV = 'development';

// Load the dependencies
var express = require('express');

var app = express();
var server = require('http').createServer(app);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var pg = require('pg');
var session = require('express-session');
var DB = require('./components/pg.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authenticate = require('./config/passport.js');

var allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if('OPTIONS' == req.method){
        res.send(200);
    } else {
        next();
    }
}

app.use(allowCrossDomain);

// Setup and Initialize socket.io
var io = require('socket.io')(server);
app.use(function(req, res, next){
  req.socket = io
  next();
})
io.on('connection', function(socket){
  console.log('socket connection');
})

app.use(session({
  secret: 'theseus',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// serve the client directory and connect to the router
// app.use(express.static('client'));
require('./routes')(app);


// Setup Facebook Authorization
app.use(bodyParser.json());
app.use(cookieParser());


// Start server on port 9000
server.listen(process.env.PORT || 9000, function () {
  console.log('Express server listening on PORT 9000');
});

// Expose app
module.exports = app;
