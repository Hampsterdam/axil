angular.module('starter.controllers', [])
.controller("AuthCtrl", function($scope){
	
})

.controller('ExploreCtrl', function($scope, $cordovaGeolocation, MediaFactory, Helpers, Socket) {

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
    Socket.on('mediaInsert', function(data) {
      Helpers.populateMap([data], map);
    })


 })

.controller('ProfileCtrl', function($scope) {

})

.controller('AddMediaCtrl', function($scope, $cordovaCamera) {
 
 // 1
 $scope.images = [];
  
 $scope.addImage = function() {
  // 2
  var options = {
    destinationType : Camera.DestinationType.FILE_URI,
    sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
    allowEdit : false,
    encodingType: Camera.EncodingType.JPEG,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: true
  };
  
  // 3
  $cordovaCamera.getPicture(options).then(function(imageData) {
  
  // 4
  onImageSuccess(imageData);
  
  function onImageSuccess(fileURI) {
  createFileEntry(fileURI);
  }
  
  function createFileEntry(fileURI) {
  window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
  }
  
  // 5
  function copyFile(fileEntry) {
  var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
  var newName = makeid() + name;
  
  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
  fileEntry.copyTo(
  fileSystem2,
  newName,
  onCopySuccess,
  fail
  );
  },
  fail);
  }
  
  // 6
  function onCopySuccess(entry) {
    $scope.$apply(function () {
      $scope.images.push(entry.nativeURL);
    });
  }
  
  function fail(error) {
    console.log("fail: " + error.code);
  }
  
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i=0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
    
    }, function(err) {
      console.log(err);
    });
   }
   $scope.addImage();
});
