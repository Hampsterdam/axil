var DB = {};
var pg = require('pg');
var config = require('../config/dbconfig.js');
fixtures = require('./fixtures.js');


DB.client = new pg.Client(config.connection);

var connectDB = function(cb, fixtures){
	DB.client.connect(function(err, client){
		console.log("Connected to database successfully");
		cb();
	});
};

(function(){
	var users          = 'CREATE TABLE IF NOT EXISTS users ('                  +
				         'id SERIAL NOT NULL PRIMARY KEY,'                     +
				         'firstname VARCHAR(50) NOT NULL,'                     +
				         'lastname VARCHAR(50) NOT NULL,'                      +
				         'email TEXT NOT NULL,'                                +
                         'password TEXT NOT NULL,'                             +
				         'joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP'          +
				         ');';

	var media          = 'CREATE TABLE IF NOT EXISTS media ('                  +
				         'id SERIAL NOT NULL PRIMARY KEY,'                     +
				         'type VARCHAR(50) NOT NULL,'          		           +
				         'lat DOUBLE PRECISION NOT NULL,'                      +
				         'lon DOUBLE PRECISION NOT NULL,'                      +
				         'uri TEXT NOT NULL,'                                  +
				         'thumb TEXT NOT NULL,'                                +
				         'time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'           +
                         'likes INTEGER NOT NULL,'                              +
				         'user_id INTEGER'                                     +
				         ');';

	var friends        = 'CREATE TABLE IF NOT EXISTS friends ('                +
				         'user_id INTEGER,'                                    +
				         'friend_id INTEGER'                                   +
				         ');';

	var tags           = 'CREATE TABLE IF NOT EXISTS tags ('                   +
			             'id SERIAL NOT NULL PRIMARY KEY,'                     +
			             'tag VARCHAR(50) NOT NULL'                            +
			             ');';

    var tags_media     = 'CREATE TABLE IF NOT EXISTS tags_media ('             +
   					     'tag_id INTEGER,'                                     +
					     'media_id INTEGER'                                    +
					     ');';

    var media_likes    = 'CREATE TABLE IF NOT EXISTS media_likes ('            +
                         'media_id INTEGER,'                                   +
                         'user_id INTEGER'                                     +
                         ');';


	connectDB(function() {
        
		//EXTENSIONS
		DB.client.query('CREATE EXTENSION IF NOT EXISTS cube', function(err, results) {
			if(err) console.log('create extension cube err: ', err)
			else console.log('added cube extension')
		})

		DB.client.query('CREATE EXTENSION IF NOT EXISTS earthdistance', function(err, result) {
			if(err) console.log('create extension earthdistance err: ',err)
			else console.log('added earthdistance extension')
		})


		//TABLE CREATION
		DB.client.query(users, function(err, results){
			if(err) console.log("users ERROR:", err);
			console.log("Created 'users' table." );
		});

		DB.client.query(media, function(err, results){
			if(err) console.log("media ERROR:", err);
			console.log("Created 'media' table." );
		});

		DB.client.query(friends, function(err, results){
			if(err) console.log("friends ERROR:", err);
			console.log("Created 'friends' table." );
		});

		DB.client.query(tags, function(err, results){
			if(err) console.log("tags ERROR:", err);
			console.log("Created 'tags' table." );
		});

        DB.client.query(tags_media, function(err, results){
			if(err) console.log("tags_media ERROR:", err);
			console.log("Created 'tags_media' table." );
		});

        DB.client.query(media_likes, function(err, results){
            if(err) console.log("tags ERROR:", err);
            console.log("Created 'media_likes' table." );
        });

	});
})();

exports = module.exports = DB;
