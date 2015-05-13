'use strict'

var DB = require('../../components/pg.js');
var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'hcnlf3ljw', 
  api_key: '513268448851729', 
  api_secret: 'zbfcsUPG9FMH9gYA25UJ2MBIlBU' 
});

exports.getMedia = function(req, res){
  var filter = req.query
  if(!Object.keys(filter).length){
    DB.client.query('SELECT * FROM media', function(err, result) {
      if (result) {
        res.status(200).json(result.rows);
      }
    });
  } else {
    getMediaByRadius(req, res)
    // var query = 'SELECT * FROM media '
    // var where = []
    // for(key in filter) {
    //   if(!filter.hasOwnProperty(key)) continue
    //   if(key === 'order' || key === 'orderBy') continue
    //   where.push(key + ' = ' + filter)
    // }
    // query += where.join(' AND ')
    // if(filter.orderBy) {
    //   if(!filter.order) res.sendStatus(400)
    //   query += ' ORDER BY ' + filter.orderBy + (filter.order > 0 ? ' ASC ;': ' DESC;')
    // }
    
  }
}

exports.getUniqueMedia = function(req, res) {
  DB.client.query('SELECT * FROM media WHERE id = $1', [req.params.media_id], function(err, result) {
    if (result && result.rows.length > 0) {
      res.status(200).json(result.rows);
    }
  });
}

exports.addMedia = function(req, res){
    console.log('url:', req.body.uri.response.url);

    var media_id, tag_id;
  	DB.client.query('INSERT INTO media (type, likes, lat, lon, uri, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [req.body.type, req.body.likes, req.body.lat, req.body.lon, req.body.uri, req.body.user_id], function(err, result) {
      if (err) {
        console.log("ERROR:", err);
      } else {
        media_id = result.rows[0].id;
        req.socket.emit('mediaInsert', result.rows[0]);
        DB.client.query('SELECT id FROM tags WHERE tag = $1', [req.body.tag], function(err, result) {
          if (result && result.rows.length > 0) {
            tag_id = result.rows[0].id;
            DB.client.query('INSERT INTO tags_media (tag_id, media_id) VALUES ($1, $2)', [tag_id, media_id], function(err, result) {
              if (err) {
                console.log("ERROR:", err);
              } else {
                res.status(201).json({
                  message: "Well done, good sir"
                });
              }
            });
          } else {
            DB.client.query('INSERT INTO tags (tag) VALUES ($1) RETURNING id', [req.body.tag], function(err, result) {
              if (err) {
                console.log("ERROR:", err);
              } else {
                tag_id = result.rows[0].id;
                DB.client.query('INSERT INTO tags_media (tag_id, media_id) VALUES ($1, $2)', [tag_id, media_id], function(err, result) {
                  if (err) {
                    console.log("ERROR:", err);
                  } else {
                    res.status(201).json({
                      message: "Well done, good sir"
                    });
                  }
                });
              }
            })
          }
        });
      }
    });

}

exports.removeMedia = function(req, res){
  DB.client.query('DELETE FROM media WHERE id = $1', [req.params.media_id], function(err, result) {
    if(err) {
      console.log("ERROR:", err);
    } else {
      DB.client.query('DELETE FROM tags_media WHERE media_id=$1', [req.params.media_id], function(err, result) {
        if(err) {
            console.log("ERROR:", err);
        } else {
            res.status(204).json({
                message: "Media removed from the database",
                result: result
            });
        }
      })
    }
  });
}

exports.updateMedia = function(req, res){

  DB.client.query("SELECT * FROM tags WHERE tag=$1", [req.params.tag], function(err, result) {
    if(result && result.rows.length > 0) {
      DB.client.query('INSERT INTO tags_media (tag_id, media_id) VALUES ($1, $2)', [result.rows[0].id, req.params.media_id], function(err, result) {
        if(err){
          console.log("ERROR:", err);
        } else {
          res.status(201).json({
            message: "tag successfully added to media"
          });
        }
      });
    } else {
      DB.client.query('INSERT INTO tags (tag) VALUES ($1) RETURNING id', [req.body.tag], function(err, result) {
        if (err) {
          console.log("ERROR:", err);
        } else {
          DB.client.query('INSERT INTO tags_media (tag_id, media_id) VALUES ($1, $2)', [result.rows[0].id, req.params.media_id], function(err, result) {
            if(err){
              console.log("ERROR:", err);
            } else {
              res.status(201).json({
                message: "tag successfully added to media"
              });
            }
          });
        }
      });
    }
  });
}

exports.userLike = function(req, res) {
  DB.client.query("INSERT INTO media_likes (media_id, user_id) VALUES ($1, $2)", [req.params.media_id, req.body.user_id], function(err, result){
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(201).json({
        message: "Message liked!"
      });
    }
  });
};

exports.userUnlike = function(req, res) {
  DB.client.query("DELETE FROM media_likes WHERE media_id = $1 AND user_id = $2", [req.params.media_id, req.body.user_id], function(err, result) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(204).json({
        message: "Message unliked :("
      });
    }
  });
};

exports.getMediaByTag = function(req, res) {
  DB.client.query("SELECT media.* FROM media JOIN tags_media ON tags_media.media_id = media.id WHERE tags_media.tag_id = (SELECT id FROM tags WHERE tag = $1)", [req.params.tag], function(err, result){
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(200).json(result.rows);
    }
  });
}

function getMediaByRadius (req, res) {
  var type = req.query.type
  var lat = parseFloat(req.query.lat)
  var lon = parseFloat(req.query.lon)
  DB.client.query("SELECT * FROM media WHERE earth_box(ll_to_earth($1, $2), $3) @> ll_to_earth(media.lat, media.lon)", [lat, lon, req.query.range], function(err, result) {
    if (err) {
      console.log("ERROR:", err);
      res.sendStatus(500)
    } else {
      res.status(200).json(result.rows);
    }
  });
}

exports.getMediaByTime = function(req, res) {
  DB.client.query("SELECT * FROM media WHERE timestamp = $1", [req.params.time], function(err, result) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.status(200).json({
        message: result
      });
    }
  });
}

exports.uploadMedia = function(req, res) {
  console.log('upload media called:', req.files.file.path);
  cloudinary.uploader.upload(req.files.file.path, function(result) { 
    console.log('cloudinary result:', result.url);
    res.status(201).json({ url: result.url });
  });
}
