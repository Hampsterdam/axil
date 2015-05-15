angular.module('axil.services', [])


// Factory for communication with the web server authentication endpoints (login and signup)
.factory('AuthFactory', function($http, myConfig) {

    // Method to query the web server for a new session
    function login (email, password) {
        $http({
            method: 'POST',
            url: myConfig.serverUrl + '/auth/login',
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
            url: myConfig.serverUrl + '/auth/signup',
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

.factory('MediaFactory', function($http, myConfig) {

    function getAllMedia () {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media'
        }).then(function(data) {
            return data
        })
    };

    function getUniqueMedia (media_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/' + media_id
        }).then(function(data) {
            return data
        });
    };

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

    function updateMedia (media_id, tag) {
        return $http({
            method: 'PUT',
            url: myConfig.serverUrl + '/media/' + media_id + '/' + tag,
        }).then(function(res) {
            return res;
        });
    };

    function deleteUniqueMedia (media_id) {
        return $http({
            method: 'DELETE',
            url: myConfig.serverUrl + '/media/' + media_id,
        }).then(function(res) {
            return res;
        });
    };

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

    function getMediaByTag (tag) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/tags/' + tag
        }).then(function (data) {
            return data;
        });
    };

    function getMediaByTime (time) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/time/' + time
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
            var img = "<img src='" + dataArray[i].uri + "' />";
            mediaData.push(dataArray[i]);
            var marker = L.marker( new L.LatLng(dataArray[i].lat, dataArray[i].lon), {
                icon: L.divIcon({
                    html: img,
                    className: 'image-icon',
                    iconSize: [52, 52]
                })
            });
            var content = '<div><img class="map_image" src="'+ dataArray[i].uri+'"><\/img><\/div>';
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










