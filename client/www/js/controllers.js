angular.module('axil.controllers', [])

.controller("LoginCtrl", function($scope, $state, $rootScope, $ionicModal, $window, AuthFactory, TokenFactory){

   $scope.loginInfo = {};
   $rootScope.authenticated = false;
   $scope.login = function() {
      AuthFactory.login($scope.loginInfo.email, $scope.loginInfo.password)
      .then(function(response){
        if (response.data.token) {
            TokenFactory.deleteToken();
            TokenFactory.setToken(response.data);
            $rootScope.authenticated = true;
            $state.go('tab.explore')
        } else {
            TokenFactory.deleteToken();
        }
      })
    }

    $scope.isError = function() {
        if ($scope.loginError) {
            return true;
        }
        return false;
    }

    $scope.logout = function() {
      TokenFactory.deleteToken();
      $rootScope.authenticated = false;
      $state.go('/login');
    }

    $scope.signupRedirect = function() {
      $state.go('/signup');
    }

})

.controller("SignupCtrl", function($scope, $rootScope, $state, AuthFactory, TokenFactory, $window) {
    $scope.signupInfo = {};
    $scope.signinError = false;
    $rootScope.authenticated = false;

    $scope.signup = function() {
      console.log("name: ", $scope.signupInfo.firstname + ' ' + $scope.signupInfo.lastname);
      AuthFactory.signup($scope.signupInfo.firstname, $scope.signupInfo.lastname, $scope.signupInfo.email, $scope.signupInfo.password)
        .then(function(response) {
          console.log("response: ", response );
          if (response.data.token) {
              TokenFactory.setToken(response.data);
              $rootScope.authenticated = true;
              $state.go("tab.explore");
          } else {
              TokenFactory.deleteToken();
              $scope.signinError = true;
          }
        });
    };

    $scope.isError = function() {
        if ($scope.signinError) {
            return true;
        }
        return false;
    }

    $scope.loginRedirect = function() {
      $state.go('/login');
    }

})

.controller('ExploreCtrl', function($scope, $cordovaGeolocation, $ionicPlatform, MediaFactory, MapFactory, Socket) {

  $ionicPlatform.ready(function() {
    var your_api_code = 'pk.eyJ1IjoiY2h1a2t3YWdvbiIsImEiOiJOajZaZTdjIn0.Qz8PSl6vP1aBB20ni7oyGg';

    // Load the Default Map
    L.mapbox.accessToken = your_api_code;
    var map = L.mapbox.map('map', 'mapbox.streets').setView([30.2698848, -97.7444182], 16);
    var clusters = new L.MarkerClusterGroup({
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
    var posOptions = { timeout: 30000, enableHighAccuracy: true };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function(position){
         MapFactory.userMarker(position.coords, user);
      }, function(err){

      })

    var watchOptions = { maximumAge: 3000, timeout: 30000, enableHighAccuracy: false };
    $cordovaGeolocation
      .watchPosition(watchOptions)
      .then(null, function(err) {
        // geolocation down, no worries
      }, function(position){
        // Set a marker at the user's location
         // No phone support for pan
         map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
         MapFactory.updateUserPosition(position.coords);
      });

    MediaFactory.getAllMedia()
      .then(function(data){
        MapFactory.populateMap(data.data, clusters, map);
    });

    // Socket connection listening for new media on the database
    Socket.on('mediaInsert', function(data) {
      MapFactory.populateMap([data], clusters, map);
    });

    // center the map on a selected marker
    clusters.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
    });

    // center the map on the user when selected
    user.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
    });
  });
 })

.controller('ProfileCtrl', function($scope, UserFactory) {
  UserFactory.getUniqueUser()
})

.controller('AddMediaCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaCapture, $cordovaFile, $state, $cordovaFileTransfer, $cordovaGeolocation, $ionicPlatform, $ionicModal, MediaFactory) {

  //Setting up modal
  $ionicPlatform.ready(function() {

    $ionicModal.fromTemplateUrl('upload-media-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    })

    $scope.openModal = function(){
      $scope.modal.show();
    }

    $scope.closeModal = function(){
      $scope.modal.hide();
    }

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    })

    $scope.images = [];
    $scope.media = {};
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

      //Launch Camera
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $rootScope.spinner = true;
        var options = {}
        //Upload request to phoenix api, then to cloudinary.
        $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload', imageData, options)
          .then(function(data){
              //data is the image url returned from clodinary.
              $scope.media.thumb = JSON.parse(data.response).url.slice(0, -3) + 'jpg';
              $scope.openModal();
              var posOptions = {timeout: 30000, enableHighAccuracy: true};
              //Get current position and save the url along with geo location to the database.
              $cordovaGeolocation.getCurrentPosition(posOptions)
              .then(function(position) {
                $state.go('tab.explore');
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var mediaFactory = MediaFactory.addMedia(data, 'image', lat, lon, '1', 'ATX', '125')
                mediaFactory.then(function(response){
                  $rootScope.spinner = false;
                })
              })
          }, function(err){
          }, false)
      }, function(err) {
        console.log(err);
      });
  }

  $scope.addVideo = function(){
    var options = { limit: 3, duration: 10 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      $rootScope.spinner = true;
      var options = {};
      // Success! Video data is here
      $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload/video', videoData[0].fullPath, options)
      .then(function(data){
        console.log("DATA: ", JSON.stringify(data));
        $scope.media.thumb = JSON.parse(data.response).url.slice(0, -3) + 'jpg';
        $scope.openModal()
        var posOptions = {timeout: 30000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function(position){
          $state.go('tab.explore');
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var mediaFactory = MediaFactory.addMedia(data, 'video', lat, lon, '1', 'ATX', '125');
          mediaFactory.then(function(response){
            console.log('Video media factory response:', response);
            $rootScope.spinner = false;
          })
        })
      })
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log('video upload error:', err);
    });
  }
});
});
