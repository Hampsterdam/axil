var jwt = require('jsonwebtoken');
var jwtSecret = 'mysecret';
var DB = require('../../components/pg.js');
var bcrypt = require('bcrypt-node');
var salt = bcrypt.genSaltSync(10);

exports.login = function(req, res) {
    var token = jwt.sign({
        email: req.body.email
    }, jwtSecret);

    DB.client.query("SELECT * FROM users WHERE email = $1", [req.body.email], function(err, results) {
        if (err) {
            console.log("Error in login:", err);
        } else {
            var hash = bcrypt.hashSync(req.body.password, salt);
            if (results.rows[0] && hash === results.rows[0].password) {
                res.status(200).json({
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "We don't have a record of that email or password"
                });
            }
        }
    });
}

exports.signup = function(req, res) {
    var token = jwt.sign({
        email: req.body.email
    }, jwtSecret);
    var hash = bcrypt.hashSync(req.body.password, salt);

    DB.client.query("SELECT * FROM users WHERE email = $1", [req.body.email], function(err, results) {
        if (err) {
            console.log("Error in signup:", err);
        } else if (results.rows.length > 0){
            res.status(401).json({
                message: "That email address is already in use"
            });
        } else {
            var hash = bcrypt.hashSync(req.body.password, salt);

            DB.client.query("INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)", [req.body.firstname, req.body.lastname, req.body.email, hash], function(err, results) {
                if (err) {
                    console.log("Error in signup:", err);
                } else {
                    var request = {body: {email: req.body.email, password: req.body.password } }
                    exports.login(request, res);
                }
            }); 
        }

    });
}

exports.logout = function(req, res) {

}