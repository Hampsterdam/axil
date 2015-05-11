angular.module('starter.controllers', [])
.controller("AuthCtrl", function($scope){
	
})

.controller('ExploreCtrl', function($scope, $cordovaGeolocation) {

    var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';
    
    L.mapbox.accessToken = your_api_code;
    var map = L.mapbox.map('map', 'mapbox.streets').setView([30.5, -97.7], 12);
    
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
         var lat = position.coords.latitude;
         var long = position.coords.longitude;

         map.panTo(new L.LatLng(lat, long));
      })


 })

.controller('ProfileCtrl', function($scope) {

})

.controller('AddMediaCtrl', function($scope) {

});
