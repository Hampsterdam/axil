var sqlFixtures = require('sql-fixtures');
var dbConfig = require('../config/dbconfig.js')

var Chance = require('chance');
var fixtures = {};
var unirest = require('unirest');
var numFix = 150

var chance = new Chance()


fixtures.createFixtures = function(){


  var data = generateFixtures(numFix);
  var dataSpec = {
    users: data.users,
    media: data.media,
    friends: data.friends,
    tags: data.tags,
    tags_media: data.tags_media
  }

    sqlFixtures.create(dbConfig, dataSpec, function(err, result){
      console.log("FIXTURES ADDED TO DATABASE");
    });

  function generateFixtures(num){
    var randTags = ['Austin', 'love it!', 'food porn', 'cats!', 'MKS', 'catz', 'USA', 'Texas', 'Sad', "Happy"];
    var users = [];
    var media = [];
    var friends = [];
    var tags = [];
    var tags_media = [];

    for(var i = 0; i < num; i++){
      var full_name = chance.name();
      full_name = full_name.split(" ");
      users.push({
        fb_id: chance.fbid(),
        firstname: full_name[0],
        lastname: full_name[1],
        hometown: chance.city(),
        email: chance.email(),
        reputation: Math.floor(Math.random() * 150)
      })

      media.push({
        type: ["image", "video"][Math.floor(Math.random() * 2)],
        likes: Math.floor(Math.random() * num),
        lat: getRandomInRange(30.135924, 30.457257, 6),
        lon: getRandomInRange(-97.958594, -97.564459, 6),
        time: randomDate('2015-05-01 00:00:00', new Date()),
        uri: "http:://my10online.com/wp-content/uploads/2011/09/4480604.jpg",
        user_id: Math.floor(Math.random() * num)
      })

      friends.push({
        user_id: Math.floor(Math.random() * (num - 1) + 1),
        friend_id: Math.floor(Math.random() * (num - 1) + 1)
      })

      tags.push({
        tag: randTags[Math.floor(Math.random() * (randTags.length -1) + 1)]
      })

      tags_media.push({
        tag_id: Math.floor(Math.random() * (num - 1)+1),
        media_id: Math.floor(Math.random() * (num - 1)+1)
      })

    }

    return {
      users: users,
      media: media,
      friends: friends,
      tags: tags,
      tags_media: tags_media
    }
  }
}


setInterval(function(){

  media = {
    type: ["image", "video"][Math.floor(Math.random() * 2)],
    likes: Math.floor(Math.random() * numFix),
    lat: getRandomInRange(30.135924, 30.457257, 6),
    lon: getRandomInRange(-97.958594, -97.564459, 6),
    uri: "http:://my10online.com/wp-content/uploads/2011/09/4480604.jpg",
    time: randomDate('2015-05-03 00:00:00', new Date()),
    user_id: Math.floor(Math.random() * numFix),
    tag: "Dude!"
  }

    unirest.post('https://phoenixapi.herokuapp.com/api/media')
      .header('Content-Type', 'application/json')
      .send(media)
      .end(function (response) {
      // console.log(response.body);
    });
}, 60 * 1000)


/////////////////////////////////////////////
//                                         //
//            HELPER FUNCTIONS             //
//                                         //
////////////////////////////////////////////
function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}


function randomDate(date1, date2) {
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var minD = Date.parse(date1);
  var maxD = Date.parse(date2);
  var random = getRandomInt(parseInt(minD), parseInt(maxD));
  var randomDate = new Date();

  randomDate.setTime(random);

  return randomDate;
}

exports = module.exports = fixtures;
