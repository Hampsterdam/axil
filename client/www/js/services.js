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
// This is a protected path on the server
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

/*--------------------------------------------------
----------------------------------------------------

USER FACTORY ("../api/users")

----------------------------------------------------
--------------------------------------------------*/

// Factory for communication with all paths starting with "../api/users"
// This is a protected path on the server
.factory('UserFactory', function($http) {
    
    // Returns all of the applications users
    function getAllUsers () {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/api/users'
        }).then(function (data) {
            return data;
        });
    };
    
    // Returns a unique user given their user_id
    function getUniqueUser (user_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/users/' + user_id
        }).then(function (data){
            return data;
        })
    }
    
    // Adds a user to the database
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

    // Returns all users that the requested user is following
    function getFollowing(user_id){
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/users/' + user_id + '/following'
        }).then(function(data){
            return data;
        })
    }
    
    // Returns all "followers" for a given user
    function getFollowers(user_id){
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/users/' + user_id + '/followers',
        }).then(function(data){
            return data;
        })
    }

    // Allows one user to follow another user
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

    // Allows one user to unfollow another user
    function unfollow(user_id, friend_id){
        return $http({
            method: 'DELETE',
            url: myConfig.serverUrl + '/users/' + user_id + '/following/' + friend_id,
        }).then(function(res){
            return res;
        })
    }

    // Exposes the Factory methods to the application
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

/*--------------------------------------------------
----------------------------------------------------

MAP FACTORY

----------------------------------------------------
--------------------------------------------------*/

// Communicates with the Mapbox API to set up the map layers for the explore page
// Defines media clusters on the map
// Added image and video thumbnails to the maplayer
.factory('MapFactory', function($ionicModal) {
    var mediaData = [];
    var marker;


    // Populates the explore map with all media organized in clusters
    function populateMap (dataArray, layer, map){

       // Set up Marker Clusters for the Map Data
        for (var i=0; i < dataArray.length; i++) {
            var img = "<img src='" + dataArray[i].thumb + "' />";
            mediaData.push(dataArray[i]);
            marker = L.marker( new L.LatLng(dataArray[i].lat, dataArray[i].lon), {
                icon: L.divIcon({
                    html: img,
                    className: 'image-icon',
                    iconSize: [52, 52],
                    uri: dataArray[i].uri,
                    thumb: dataArray[i].thumb,
                    type: dataArray[i].type 
                })
            });
            // If the media is an image, add an image tag to the map
            if(dataArray[i].type === 'image'){
              var content = '<div><img class="map_image" src="'+ dataArray[i].uri+'"><\/img><\/div>';
            // If the media is a video, add a video tag to the map 
            } else {
              var content = '<div><video class="map_image" controls autoplay src="' + dataArray[i].uri + '"></video></div>'
            }
            marker.bindPopup(content);
            layer.addLayer(marker);
        }
        map.addLayer(layer);
    }
    
    // Defines the user marker that shows where the user is on the map
    function userMarker (coords, layer) {
        marker = L.circleMarker( new L.LatLng(coords.latitude, coords.longitude), {
            icon: L.mapbox.marker.icon({'marker-color': '#0080ff', 'marker-size': 'large'})
        });
        layer.addLayer(marker);

    }
    
    // Updates the user marker location as their geolocation changes
    function updateUserPosition (coords){
        marker.setLatLng(L.latLng(coords.latitude, coords.longitude));
    }

    // Expose the Factory methods to the application
    return {
        populateMap: populateMap,
        userMarker: userMarker,
        updateUserPosition: updateUserPosition
    }
})

/*--------------------------------------------------
----------------------------------------------------

SOCKET FACTORY

----------------------------------------------------
--------------------------------------------------*/

// Set's up the socket.io connection with the API
// Allows for real time page updates as media is added to the explore page
.factory('Socket', function($rootScope, myConfig){
    // Create the socket connection with the API
    var socket = io.connect(myConfig.socketUrl);
      // Define the basic socket events that we'll utilize in the application
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

/*--------------------------------------------------
----------------------------------------------------

TOKEN FACTORY

----------------------------------------------------
--------------------------------------------------*/

// Manages json web tokens provided by the server when a user logs-in
.factory('TokenFactory', function($window) {
    
    // Set the user token in local storage when they log in
    function setToken(data) {
        if(data.token){
            $window.localStorage.setItem('token', data.token);
            $window.localStorage.setItem('user_id', data.user_id);
        } else {
            deleteToken();
        }
    }
    
    // Fetch the user-token from local storage
    function getToken() {
        return $window.localStorage.getItem('token');
    }
    
    // Delete the user token (when they log out or in the event of an error)
    function deleteToken() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user_id');
    }
    
    // Expose the methods to the application
    return {
        setToken: setToken,
        getToken: getToken,
        deleteToken: deleteToken
    };

})

/*--------------------------------------------------
----------------------------------------------------

INTERCEPTOR FACTORY 

----------------------------------------------------
--------------------------------------------------*/

// Defines an HTTP interceptor
// This factory is called in app.js to add the user_token to every API request
// Protected API routes require a token for access, otherwise the server sends a 400
.factory('Interceptor', function(TokenFactory) {
    function request(config){
        var token = TokenFactory.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    }

    return {
        request: request
    }
})
