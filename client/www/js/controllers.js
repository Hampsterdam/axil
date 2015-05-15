angular.module('axil.controllers', [])

.controller("LoginCtrl", function($scope, $rootScope, $window, AuthFactory){
	$scope.email = "";
    $scope.password = "";

    $scope.login = function() {
        var response = AuthFactory.login($scope.email, $scope.password);
        if (response.token) {
            $window.sessionStorage.token = response.token;
        } else {
            delete $window.sessionStorage.token;
            $scope.loginError = true;
        }
    }

    $scope.isError = function() {
        if ($scope.loginError) {
            return true;
        }
        return false;
    }


})

.controller("SignUpCtrl", function($scope, $window, AuthFactory) {
    $scope.email = "";
    $scope.password = "";
    $scope.firstname = "firstname";
    $scope.lastname = "lastname";
    $scope.signinError = false;

    $scope.signup = function() {
        var response = AuthFactory.login($scope.email, $scope.password, $scope.firstname, $scope.lastname)
        if (resonse.token) {
            $window.sessionStorage.token = response.token;
        } else {
            delete $window.sessionStorage.token;
            $scope.signinError = true;
        }
    };

    $scope.isError = function() {
        if ($scope.signinError) {
            return true;
        }
        return false;
    }

})

.controller('ExploreCtrl', function($scope, $cordovaGeolocation, MediaFactory, MapFactory, Socket) {

    var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';
    
    // Load the Default Map
    L.mapbox.accessToken = your_api_code;
    var map = L.mapbox.map('map', 'mapbox.streets').setView([30.2698848, -97.7444182], 16);
    // var mainlayer = L.mapbox.featureLayer().addTo(map);
    var marker = new L.MarkerClusterGroup({
      // The iconCreateFunction takes the cluster as an argument and returns
      // an icon that represents it. We use L.mapbox.marker.icon in this
      // example, but you could also use L.icon or L.divIcon.
      iconCreateFunction: function(cluster) {
        return L.mapbox.marker.icon({
          // show the number of markers in the cluster on the icon.
          'marker-symbol': cluster.getChildCount(),
          'marker-color': '#ff8888',
          'marker-size': 'large'
        });
      }
    });
    var user = new L.mapbox.featureLayer().addTo(map);

    // Get the user position and move the map to their location;
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        
        // Set a marker at the user's location
         MapFactory.userMarker(position.coords, user);

         // No phone support for pan
         map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));

      }, function(err){
        alert("geolocation error" + err);
    })

    MediaFactory.getAllMedia()
      .then(function(data){
        MapFactory.populateMap(data.data, marker, map);
    });

    // Socket connection listening for new media on the database
    Socket.on('mediaInsert', function(data) {
      MapFactory.populateMap([data], marker, map);
    });

    // center the map on a selected marker
    marker.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
    });

    // center the map on the user when selected
    user.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
    });

 })

.controller('ProfileCtrl', function($scope, UserFactory) {
  UserFactory.getUniqueUser()
})

.controller('AddMediaCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaFile, $state, $cordovaFileTransfer, $cordovaGeolocation, MediaFactory) {

  document.addEventListener('deviceready', function(){
    $scope.images = [];
    $rootScope.spinner = false;  
    $scope.addImage = function() {
      var options = {
        quality: 15,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $state.go('tab.explore');
        $rootScope.spinner = true;
        var options = {}
        $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload', imageData, options)
          .then(function(data){
              var posOptions = {timeout: 10000, enableHighAccuracy: true};
              $cordovaGeolocation.getCurrentPosition(posOptions)
              .then(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var mediaFactory = MediaFactory.addMedia(data, 'image', lat, lon, '1', 'ATX', '125')
                mediaFactory.then(function(response){
                    
                var mediaFactory = MediaFactory.addMedia(data, 'image', lat, lon, '1', 'ATX', '125')
                mediaFactory.then(function(response){
                  $rootScope.spinner = false;
                  alert("Image Upload Success");
                })
              })
          }, function(err){
          }, false)
      }, function(err) {
        console.log(err);
      });
    })  
  }
});
});

