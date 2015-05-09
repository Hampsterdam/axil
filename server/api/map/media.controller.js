'use strict'

var DB = require('../../components/pg.js')


exports.getByArea = function(req, res) {
  var query = [
    'SELECT * FROM media WHERE earth_box(' + userLat,
    ',' + userLong + ',' + radius + ')'
  ].join('')
  DB.client.query(query, function(err, result) {
    if(err) console.log('getByArea err: ', err)
    else res.status(200).json(result.rows)
  })
}