var passport         = require('passport');
var session          = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var DB               = require('../components/pg.js');
var GoogleStrategy   = require('passport-google-oauth2').Strategy

// load the auth variables
var configAuth = require('./auth.js');

module.exports = {
  
  facebook: {

    serialize: passport.serializeUser(function(user, done) {
      DB.client.query("SELECT * FROM users WHERE fb_id = $1", [user.id], function(err, selectResult) {
        if (err) {
          return done(err);
        } else if (selectResult.rows.length===0) {
          DB.client.query("INSERT INTO users (fb_id, firstname, lastname, hometown, email) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user.id, user.name.givenName, user.name.familyName, user._json.location.name, user.emails[0].value], function(err, insertResult) {
            if(err) {
              done(null, err);
            } else {
              done(null, insertResult.rows[0]);
            }
         })
        } else {
          done(null, selectResult.rows[0]);
        }
      })
    }),

    deserialize: passport.deserializeUser(function(obj, done) {
       DB.client.query("SELECT * FROM users WHERE fb_id=$1", [obj.id], function(err, result) {
          if (err) {
            done(null, err);
          } else {
            done(null, result);
          }
       });
    }),

    strategy: passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    ))
  }

};