angular.module('phoenix.services', [])


// Factory for communication with the web server authentication endpoints (login and signup)
.factory('AuthFactory', function($http) {

    // Method to query the web server for a new session
    function login (email, password) {
        $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/auth/login',
            data: {
                email: email,
                password: password
            }
        }).then(function(response) {
            return response;
        });
    };


    function signup (firstname, lastname, email, password) {
        $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/auth/signup',
            data: {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }
        }).then(function(response) {
            $window.sessionStorage.token = response.token;
        });
    };

    return {
        login: login,
        signup: signup
    };

})

.factory('MediaFactory', function($http) {

    function getAllMedia () {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/media'
        }).then(function(data) {
            return data
        })
    };

    function getUniqueMedia (media_id) {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/media/'+media_id
        }).then(function(data) {
            return data
        });
    };

    function addMedia (uri, type, lat, lon, user_id, tag, likes) {
        return $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/media',
            data: {
                uri: uri,
                type: type,
                lat: lat,
                lon: lon,
                user_id: user_id,
                tag: tag,
                likes: likes
            }
        }).then(function(res) {
            return res;
        });
    };

    function updateMedia (media_id, tag) {
        return $http({
            method: 'PUT',
            url: 'https://phoenixapi.herokuapp.com/api/media/' + media_id + '/' + tag,
        }).then(function(res) {
            return res;
        });
    };

    function deleteUniqueMedia (media_id) {
        return $http({
            method: 'DELETE',
            url: 'https://phoenixapi.herokuapp.com/api/media/' + media_id,
        }).then(function(res) {
            return res;
        });
    };

    function likeMedia (media_id, user_id) {
        return $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/media/' + media_id,
            data: {
                user_id: user_id
            }
        }).then(function(res) {
            return res;
        });
    };

    function unlikeMedia (media_id, user_id) {
        return $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/media/' + media_id,
            data: {
                user_id: user_id
            }
        }).then(function(res) {
            return res;
        });
    };

    function getMediaByTag (tag) {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/media/tags/' + tag
        }).then(function (data) {
            return data;
        });
    };

    function getMediaByTime (time) {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/media/time/' + time
        }).then(function (data) {
            return data;
        });
    };

    return {
        addMedia: addMedia, 
        getAllMedia: getAllMedia,
        getUniqueMedia: getUniqueMedia,
        likeMedia: likeMedia,
        unlikeMedia: unlikeMedia,
        getMediaByTag: getMediaByTag,
        getMediaByTime: getMediaByTime
    }

})

.factory('UserFactory', function($http) {

    function getAllUsers () {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/users'
        }).then(function (data) {
            return data;
        });
    };

    function getUniqueUser (user_id) {
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/api/users/' + user_id
        }).then(function (data){
            return data;
        })
    }

    function addUser(firstname, lastname, hometown, email){
        return $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/api/users/',
            data: {
                firstname: firstname,
                lastname: lastname,
                hometown: hometown,
                email: email
            }
        }).then(function (data){
            return data; 
        })
    }

    function getFollowing(user_id){
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/' + user_id + '/following' 
        }).then(function(data){
            return data;
        })
    }

    function getFollowers(user_id){
        return $http({
            method: 'GET',
            url: 'https://phoenixapi.herokuapp.com/' + user_id + '/followers',
        }).then(function(data){
            return data;
        })
    }

    function follow(user_id, friend_id){
        return $http({
            method: 'POST',
            url: 'https://phoenixapi.herokuapp.com/' + user_id + '/following',
            data: {
                friend_id: friend_id
            }
        }).then(function(res){
            return res;
        })
    }

    function unfollow(user_id, friend_id){
        return $http({
            method: 'DELETE',
            url: 'https://phoenixapi.herokuapp.com/' + user_id + '/following/' + friend_id,
        }).then(function(res){
            return res;
        })
    }

    return {
        getAllUsers: getAllUsers,
        getUniqueUser: getUniqueUser,
        addUser: addUser,
        getFollowing: getFollowing,
        getFollowers: getFollowers,
        follow: follow,
        unfollow: unfollow
    }
})

.factory('Helpers', function(){
    function populateMap (dataArray, layer){
        var geoJSON = []
        dataArray.forEach(function(media){
            console.log("media", media);
            geoJSON.push({
                type: 'Feature',
                "geometry": { "type": "Point", "coordinates": [media.lon, media.lat]},
                "properties": {
                    "image": media.uri,
                    "marker-symbol": "star",
                    "marker-color": "#ff8888",
                    "marker-size": "large",
                    "city": "Washington, D.C."
                }   
             })
        })

        layer.on('layeradd', function(e) {
            var marker = e.layer,
                feature = marker.feature;

            // Create custom popup content
            var popupContent =  '<a target="_blank" class="popup">' +
                                    '<img class="map_image" src="' + feature.properties.image + '" />' +
                                '</a>';

            // http://leafletjs.com/reference.html#popup
            marker.bindPopup(popupContent,{
                closeButton: false,
                minWidth: 320
            });
        });
        layer.setGeoJSON(geoJSON);
    }
    return {
        populateMap: populateMap
    }
})
.factory('Socket', function($rootScope){
    var socket = io.connect('https://phoenixapi.herokuapp.com:443');
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
})










