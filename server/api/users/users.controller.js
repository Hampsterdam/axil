'use strict';

var DB = require('../../components/pg.js');

exports.getUsers = function(req, res) {
	DB.client.query('SELECT (firstname, lastname, email, joined) FROM users', function(err, result){
    if (result && result.rows.length > 0) {
      res.status(200).json(result.rows);
    }
  });
};

exports.getUniqueUser = function(req, res) {
  DB.client.query("SELECT (firstname, lastname, email, joined) FROM users WHERE id = $1", [req.params.user_id], function(err, result) {
    if (result && result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({
        message: "The user_id you requested does not exist in our database"
      });
    }
  });
}

exports.getFollowing = function(req,res){
  DB.client.query("SELECT (firstname, lastname, email, joined) FROM friends JOIN users ON users.id = friends.friend_id WHERE user_id = $1", [req.params.user_id], function(err, result){
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(200).json(result.rows);
    }
  });
};

exports.getFollowers = function(req, res) {
  DB.client.query("SELECT (firstname, lastname, email, joined) FROM friends JOIN users ON users.id = friends.user_id WHERE friend_id = $1", [req.params.user_id], function(err, result) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(200).json(result.rows);
    }
  });
};

exports.addUser = function(req, res){
  DB.client.query("INSERT INTO users (firstname, lastname, hometown, email) values ($1, $2, $3, $4) RETURNING id", [req.body.firstname, req.body.lastname, req.body.hometown, req.body.email], function(err, result){
    if(err){
      console.log("ERROR:", err);
    } else {
      res.status(201).json({
        message: "Inserted into users table",
        user_id: result.rows[0].id
      });
    }
  });
};

exports.follow = function(req, res){
  DB.client.query("INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)", [req.params.user_id, req.body.friend_id], function(err, result){
    if(err){
      console.log("ERROR:", err);
    } else {
      res.send(201);
    }
  });
};

exports.unfollow = function(req, res){
  DB.client.query("DELETE FROM friends WHERE user_id = $1 AND friend_id = $2",[req.params.user_id, req.params.friend_id], function(err, result){
    if(err){
      console.log("ERROR:", err);
    } else {
      res.send(204);
    }
  });
};
