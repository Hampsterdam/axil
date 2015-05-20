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
            return data;
        });
    };
    
    // Get media by it's unique identifier
    function getUniqueMedia (media_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/' + media_id
        }).then(function(data) {
            return data;
        });
    };
    
    // Get All Media By a Unique User
    function getMediaByUser (user_id) {
        return $http({
            method: 'GET',
            url: myConfig.serverUrl + '/media/mediabyuser/' + user_id
        }).then(function(data) {
            return data;
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
        getMediaByUser: getMediaByUser,
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
.factory('UserFactory', function($http, myConfig) {
    
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
.factory('MapFactory', function($ionicModal, MediaFactory, Helpers) {
    var mediaData = [];
    var marker;


    // Populates the explore map with all media organized in clusters
    function populateMap (dataArray, layer, map){

       // Set up Marker Clusters for the Map Data
        for (var i=0; i < dataArray.length; i++) {
            marker = makeMarker(dataArray[i]);

            //The cluster layer in this situation
            layer.addLayer(marker);
        }
        map.addLayer(layer);
    }

    // Method the generates a Map Marker
    function makeMarker (media) {
      var marker;
      var img = "<img src='" + media.thumb + "' />";

      marker = L.marker( new L.LatLng(media.lat, media.lon), {
          icon: L.divIcon({
              html: img,
              className: 'image-icon',
              iconSize: [52, 52]
          })
      });
      marker.mediaData = {
          uri: media.uri,
          thumb: media.thumb,
          type: media.type ,
          likes: media.likes,
          id: media.id,
          firstname: media.firstname,
          lastname: media.lastname,
          email: Helpers.get_gravatar(media.email, 50)  
      }
      return marker;
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

    // Updates a Specific Marker on the Map Layer when it's changed (liked, addedTag)
    function replaceMarker (media_id, layer, map) {
      media_id = parseInt(media_id);
      // Replace the unique marker with updated marker (new mediaInfo)
      layer.eachLayer(function(marker) {
        if (marker.mediaData.id === media_id) {
          layer.removeLayer(marker);
          MediaFactory.getUniqueMedia(media_id)
          .then(function(media) {
            map.removeLayer(layer);
            var marker = makeMarker(media.data[0]);
            layer.addLayer(marker);
            map.addLayer(layer);
          });
        }
      });
    }

    function addMarkerToMap (mediaData, layer, map) {
        var marker = makeMarker(mediaData);
        map.removeLayer(layer);
        layer.addLayer(marker);
        map.addLayer(layer);
    }

    // Remove a Specific Marker from the Map when it's removed from the Database
    function removeMarker (media_id) {
        // remove the marker from the map
    }

    // Expose the Factory methods to the application
    return {
        populateMap: populateMap,
        userMarker: userMarker,
        makeMarker: makeMarker,
        updateUserPosition: updateUserPosition,
        removeMarker: removeMarker,
        addMarkerToMap: addMarkerToMap,
        replaceMarker: replaceMarker
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
.factory('TokenFactory', function($window, $rootScope) {
    
    // Set the user token in local storage when they log in
    function setToken(data) {
        if(data.token){
            $window.localStorage.setItem('token', data.token);
            $window.localStorage.setItem('user_id', data.user_id);
            $rootScope.userInfo.id = data.user_id;
        } else {
            deleteToken();
        }
    }
    
    // Fetch the user-token from local storage
    function getToken() {
        return $window.localStorage.getItem('token');
    }

    function getUserId() {
        return $window.localStorage.getItem('user_id');
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
        getUserId: getUserId,
        deleteToken: deleteToken
    };
})

/*--------------------------------------------------
----------------------------------------------------

HELPERS FACTORY 

----------------------------------------------------
--------------------------------------------------*/

.factory('Helpers', function(){
    function get_gravatar(email, size) {
        // MD5 (Message-Digest Algorithm) by WebToolkit
        var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
        var size = size || 80;
     
        return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
    }

    return {
        get_gravatar: get_gravatar
    }
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
