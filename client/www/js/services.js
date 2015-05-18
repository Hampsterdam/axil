angular.module('axil.services', [])


/*--------------------------------------------------
----------------------------------------------------

AUTH FACTORY ("../api/auth")

----------------------------------------------------
--------------------------------------------------*/

// Factory for communication with the API authentication endpoints (login and signup)
.factory('AuthFactory', function($http, myConfig) {

    // Method to query the API for a new session.
    function login (email, password) {
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/auth/login',
            data: {
                email: email,
                password: password
            }
        }).success(function(response) {
            return response;
        });
    };

    // Signup a new user, the API will also log the user in if the signup was successful.
    function signup (firstname, lastname, email, password) {
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/auth/signup',
            data: {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }
        }).then(function(response) {
            return response;
        });
    };
    
    // Expose the Auth methods to the rest of the application
    return {
        login: login,
        signup: signup
    };

})

/*--------------------------------------------------
----------------------------------------------------

MEDIA FACTORY ("../api/media")

----------------------------------------------------
--------------------------------------------------*/

// Media Factory communicates with the any api endpoint starting with ".../api/media"
.factory('MediaFactory', function($http, myConfig) {

    // Method to fetch all media in the database
    function getAllMedia () {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media'
        }).then(function(data) {
            return data
        });
    };
    
    // Get media by it's unique identifier
    function getUniqueMedia (media_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/' + media_id
        }).then(function(data) {
            return data
        });
    };
    
    // Add media to the database
    function addMedia (uri, type, lat, lon, user_id, tag, likes) {
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/media',
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
    
    // Update existing media (with new tags)
    function updateMedia (media_id, tag) {
        return $http({
            method: 'PUT',
            url: myConfig.serverUrl + '/media/' + media_id + '/' + tag,
        }).then(function(res) {
            return res;
        });
    };
    
    // Delete media from the database (and any relationships that media has)
    function deleteUniqueMedia (media_id) {
        return $http({
            method: 'DELETE',
            url: myConfig.serverUrl + '/media/' + media_id,
        }).then(function(res) {
            return res;
        });
    };
     
    // Method for a user to "like" media
    function likeMedia (media_id, user_id) {
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/media/' + media_id,
            data: {
                user_id: user_id
            }
        }).then(function(res) {
            return res;
        });
    };

    // Method for a user to "unlike" media
    function unlikeMedia (media_id, user_id) {
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/media/' + media_id,
            data: {
                user_id: user_id
            }
        }).then(function(res) {
            return res;
        });
    };

    // Fetch all Media that has a given "tag"
    function getMediaByTag (tag) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/tags/' + tag
        }).then(function (data) {
            return data;
        });
    };

    // Fetch all media associated with given time frame
    function getMediaByTime (time) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/time/' + time
        }).then(function (data) {
            return data;
        });
    };

    // Expose the Media Factory Methods to the rest of the application
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
            url: myConfig.serverUrl + '/api/users'
        }).then(function (data) {
            return data;
        });
    };

    function getUniqueUser (user_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/users/' + user_id
        }).then(function (data){
            return data;
        })
    }

    function addUser(firstname, lastname, hometown, email){
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/users/',
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
            url: myConfig.serverUrl + '/users/' + user_id + '/following'
        }).then(function(data){
            return data;
        })
    }

    function getFollowers(user_id){
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/users/' + user_id + '/followers',
        }).then(function(data){
            return data;
        })
    }

    function follow(user_id, friend_id){
        return $http({
            method: 'POST',
            url: myConfig.serverUrl + '/users/' + user_id + '/following',
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
            url: myConfig.serverUrl + '/users/' + user_id + '/following/' + friend_id,
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

.factory('MapFactory', function() {
    var mediaData = [];
    var marker;

    function populateMap (dataArray, layer, map){

       // Set up Marker Clusters for the Map Data
        for (var i=0; i < dataArray.length; i++) {
            var img = "<img src='" + dataArray[i].thumb + "' />";
            mediaData.push(dataArray[i]);
            var marker = L.marker( new L.LatLng(dataArray[i].lat, dataArray[i].lon), {
                icon: L.divIcon({
                    html: img,
                    className: 'image-icon',
                    iconSize: [52, 52]
                })
            });
            if(dataArray[i].type === 'image'){
              var content = '<div><img class="map_image" src="'+ dataArray[i].uri+'"><\/img><\/div>';
            } else {
              var content = '<div><video class="map_image" controls autoplay src="' + dataArray[i].uri + '"></video></div>'
            }
            marker.bindPopup(content);
            layer.addLayer(marker);
        }
        map.addLayer(layer);
    }

    function userMarker (coords, layer) {
        marker = L.circleMarker( new L.LatLng(coords.latitude, coords.longitude), {
            icon: L.mapbox.marker.icon({'marker-color': '#0080ff', 'marker-size': 'large'})
        });
        layer.addLayer(marker);

    }

    function updateUserPosition (coords){
        marker.setLatLng(L.latLng(coords.latitude, coords.longitude));
    }
    return {
        populateMap: populateMap,
        userMarker: userMarker,
        updateUserPosition: updateUserPosition
    }
})
.factory('Socket', function($rootScope, myConfig){
    var socket = io.connect(myConfig.socketUrl);
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
.factory('TokenFactory', function($window) {
    function setToken(data) {
        if(data.token){
            $window.localStorage.setItem('token', data.token);
            $window.localStorage.setItem('user_id', data.user_id);
        } else {
            deleteToken();
        }
    }

    function getToken() {
        return $window.localStorage.getItem('token');
    }

    function deleteToken() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user_id');
    }

    return {
        setToken: setToken,
        getToken: getToken,
        deleteToken: deleteToken
    };

})
.factory('Interceptor', function(TokenFactory) {
    function request(config){
        var token = TokenFactory.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        // console.log('#####Interceptor config:', JSON.stringify(config));
        // console.log('________________________________________________________________');
        return config;
    }

    return {
        request: request
    }
})
