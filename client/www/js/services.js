angular.module('starter.services', [])

.factory('MediaFactory', function($http) {

    function getAllMedia () {
        return $http({
            method: 'GET',
            url: 'http://localhost:9000/api/media'
        }).then(function(data) {
            return data
        })
    };

    function getUniqueMedia (media_id) {
        return $http({
            method: 'GET',
            url: 'http://localhost:9000/api/media/'+media_id
        }).then(function(data) {
            return data
        });
    };

    // function addMedia (video_url, type, lat, lon, user_id) {
    //     return $http({
    //         method: 'POST',
    //         url: 'http://localhost:9000/api/media',
    //         data: {
    //             uri: video_url,
    //             type: type,
    //             lat: lat,
    //             lon: lon,
    //             user_id
    //         }
    //     }).then(function(res) {
    //         return res;
    //     });
    // };

    // function updateMedia (media_id, tag) {
    //     return $http({
    //         method: 'PUT',
    //         url: 'http://localhost:9000/api/media/' + media_id + '/' + tag,
    //     }).then(function(res) {
    //         return res;
    //     });
    // };

    // function deleteUniqueMedia (media_id) {
    //     return $http({
    //         method: 'DELETE',
    //         url: 'http://localhost:9000/api/media/' + media_id,
    //     }).then(function(res) {
    //         return res;
    //     });
    // };

    // function likeMedia (media_id, user_id) {
    //     return $http({
    //         method: 'POST',
    //         url: 'http://localhost:9000/api/media/' + media_id,
    //         data: {
    //             user_id: user_id
    //         }
    //     }).then(function(res) {
    //         return res;
    //     });
    // };

    // function unlikeMedia (media_id, user_id) {
    //     return $http({
    //         method: 'POST',
    //         url: 'http://localhost:9000/api/media/' + media_id,
    //         data: {
    //             user_id: user_id
    //         }
    //     }).then(function(res) {
    //         return res;
    //     });
    // };

    // function getMediaByTag (tag) {
    //     return $http({
    //         method: 'GET',
    //         url: 'http://localhost:9000/api/media/tags/' + tag
    //     }).then(function (data) {
    //         return data;
    //     });
    // };

    // function getMediaByTime (time) {
    //     return $http({
    //         method: 'GET',
    //         url: 'http://localhost:9000/api/media/time/' + time
    //     }).then(function (data) {
    //         return data;
    //     });
    // };

    return {
        getAllMedia: getAllMedia //DONT FORGET COMMA
        // getUniqueMedia: getUniqueMedia,
        // likeMedia: likeMedia,
        // unlikeMedia: unlikeMedia,
        // getMediaByTag: getMediaByTag,
        // getMediaByTime: getMediaByTime
    }

})

.factory('UserFactory', function($http) {

//     function getAllUsers () {
//         return $http({
//             method: 'GET',
//             url: 'http://localhost:9000/api/users'
//         }).then(function (data) {
//             return data;
//         });
//     };

//     function getUniqueUser (user_id) {
//         return $http({
//             method: 'GET',
//             url: 'http://localhost:9000/api/users/' + user_id
//         }).then(function (data){
//             return data;
//         })
//     }

//     function addUser(firstname, lastname, hometown, email){
//         return $http({
//             method: 'POST',
//             url: 'http://localhost:9000/api/users/',
//             data: {
//                 firstname: firstname,
//                 lastname: lastname,
//                 hometown: hometown,
//                 email: email
//             }
//         }).then(function (data){
//             return data; 
//         })
//     }

//     function getFollowing(user_id){
//         return $http({
//             method: 'GET',
//             url: 'http://localhost:9000/' + user_id + '/following' 
//         }).then(function(data){
//             return data;
//         })
//     }

//     function getFollowers(user_id){
//         return $http({
//             method: 'GET',
//             url: 'http://localhost:9000/' + user_id + '/followers',
//         }).then(function(data){
//             return data;
//         })
//     }

//     function follow(user_id, friend_id){
//         return $http({
//             method: 'POST',
//             url: 'http://localhost:9000/' + user_id + '/following',
//             data: {
//                 friend_id: friend_id
//             }
//         }).then(function(res){
//             return res;
//         })
//     }

//     function unfollow(user_id, friend_id){
//         return $http({
//             method: 'DELETE',
//             url: 'http://localhost:9000/' + user_id + '/following/' + friend_id,
//         }).then(function(res){
//             return res;
//         })
//     }

    // return {
    //     // getAllUsers: getAllUsers,
    //     // getUniqueUser: getUniqueUser,
    //     // addUser: addUser,
    //     // getFollowing: getFollowing,
    //     // getFollowers: getFollowers,
    //     // follow: follow,
    //     // unfollow: unfollow
    // }
})

.factory('Helpers', function(){
    function populateMap (dataArray, map){
        dataArray.forEach(function(media){
           L.mapbox.featureLayer({
               // this feature is in the GeoJSON format: see geojson.org
               // for the full specification
               type: 'Feature',
               geometry: {
                   type: 'Point',
                   // coordinates here are in longitude, latitude order because
                   // x, y is the standard for GeoJSON and many formats
                   coordinates: [
                     media.lon, 
                     media.lat
                   ]
               },
               properties: {
                   title: 'Peregrine Espresso',
                   description: '1718 14th St NW, Washington, DC',
                   // one can customize markers by adding simplestyle properties
                   // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                   'marker-size': 'large',
                   'marker-color': '#BE9A6B',
                   'marker-symbol': 'cafe'
               }
           }).addTo(map); 
        })
    }

    return {
        populateMap: populateMap
    }
})










