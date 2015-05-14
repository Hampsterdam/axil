angular.module('phoenix.controllers', [])

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

.controller('ExploreCtrl', function($scope, $cordovaGeolocation, MediaFactory, Helpers, Socket) {

    var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';
    
    L.mapbox.accessToken = your_api_code;
    var map = L.mapbox.map('map', 'mapbox.streets').setView([30.3077609, -97.7534014], 12);
    var mainLayer = L.mapbox.featureLayer().addTo(map);
    
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
         var lat = position.coords.latitude;
         var lon = position.coords.longitude;

         map.panTo(new L.LatLng(lat, lon));
      }, function(err){
        alert("geolocation error" + err);
      })

    var mediaFactory = MediaFactory.getAllMedia()
    mediaFactory.then(function(data){
        Helpers.populateMap(data.data, mainLayer);
    })
    Socket.on('mediaInsert', function(data) {
      Helpers.populateMap([data], mainLayer);
    })


 })

.controller('ProfileCtrl', function($scope) {

})

.controller('AddMediaCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaFile, $state, $cordovaFileTransfer, MediaFactory) {

  document.addEventListener('deviceready', function(){
    $scope.images = [];
    $rootScope.spinner = false;  
    $scope.addImage = function() {
      var options = {
        quality: 25,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $state.go('tab.explore');
        $rootScope.spinner = true;
        var options = {}
        $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload', imageData, options)
          .then(function(data){
            var mediaFactory = MediaFactory.addMedia(data, 'image', '30.56', '-97.45', '1', 'ATX', '125')
            mediaFactory.then(function(response){
                
            var mediaFactory = MediaFactory.addMedia(data, 'image', '30.56', '-97.45', '1', 'ATX', '125')
            mediaFactory.then(function(response){
              $rootScope.spinner = false;
              alert("Image Upload Success");
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

