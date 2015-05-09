var passport = require('passport');
var myAuthFile = require('../../config/passport.js');

exports.loginWithFacebook = passport.authenticate('facebook', {scope: ['email', 'user_friends', 'user_location']});

exports.loginWithFacebookRedirect = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/welcome'
});

exports.loginWithGoogle = passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']});
exports.loginWithGoogleRedirect = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/welcome'
});

exports.checkAuthentication = function(req, res) {
  res.status(200).json(req.isAuthenticated());
};

exports.getUserInfo = function(req, res) {
  res.status(200).json({
    isAuth: req.isAuthenticated(),
    user: req.session || 'none'
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/welcome');
};
