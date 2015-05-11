angular.module('starter.controllers', [])
.controller("AuthCtrl", function($scope){
	
})

.controller('ExploreCtrl', function($scope, $cordovaGeolocation, MediaFactory, Helpers) {

    var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';
    
    L.mapbox.accessToken = your_api_code;
    var map = L.mapbox.map('map', 'mapbox.streets').setView([30.3077609, -97.7534014], 12);
    
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
         var lat = position.coords.latitude;
         var long = position.coords.longitude;

         map.panTo(new L.LatLng(lat, long));
      })
    var mediaFactory = MediaFactory.getAllMedia()
    mediaFactory.then(function(data){
        Helpers.populateMap(data.data, map);
    })



 })

.controller('ProfileCtrl', function($scope) {

})

.controller('AddMediaCtrl', function($scope) {

});
