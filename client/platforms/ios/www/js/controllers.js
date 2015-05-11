angular.module('starter.controllers', [])
.controller("AuthCtrl", function($scope){
	
})

.controller('ExploreCtrl', function($scope, $cordovaGeoLocation) {

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeoLocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
         var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';
         var lat = position.coords.latitude;
         var long = position.coords.longitude;

         L.mapbox.accessToken = your_api_code;
         L.mapbox.map('map', 'mapbox.streets').setView([lat, long], 12);
      })


 })

.controller('ProfileCtrl', function($scope) {

})

.controller('AddMediaCtrl', function($scope) {

});
