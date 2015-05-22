angular.module('axil.uploadctrl', [])

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 ADD MEDIA CONTROLLER                                 //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////

// Main Controller for the Add Media Tab ( the camera )
.controller('AddMediaCtrl', function($rootScope, $scope, $cordovaCamera, $cordovaCapture, $cordovaFile, $state, $cordovaFileTransfer, $cordovaGeolocation, $ionicPlatform, $ionicModal, $ionicLoading, MediaFactory, TokenFactory, Socket) {

  //Setting up the Upload Media Modal that will pop up after the user has taken a video/picture
  $ionicPlatform.ready(function() {

    $ionicModal.fromTemplateUrl('upload-media-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });

    $scope.openModal = function(){
      $scope.modal.show();
    };

    $scope.closeModal = function(){
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

    $scope.images = [];
    $scope.media = {};
    $rootScope.spinner = false; 
    
    //User info needed to associate the uploaded media with the logged in user
    $scope.userInfo = {};
    $scope.userInfo.user_id = TokenFactory.getUserId();
    
    // Upload info captured in the upload media modal (tab-camera.html)
    $scope.uploadInfo = {};
    $scope.uploadInfo.tags = "";

    // If the user opts to add an image, this method will be called
    $scope.addImage = function() {

      // Set the options for image upload to the server/cloudinary
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
        //show loading template
        $ionicLoading.show({ template: "Sending..." });
        //Upload request to phoenix api, then to cloudinary.
        $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload', imageData, options)
          .then(function(data){
              //data is the image url returned from clodinary. Set the image thumbail
              $scope.media.thumb = JSON.parse(data.response).url.slice(0, -3) + 'jpg';
              //hide loading message
              $ionicLoading.hide();
              // Open the uplaod media modal
              $scope.openModal();
              var posOptions = {timeout: 30000, enableHighAccuracy: true};
              //Get current position and save the url along with geo location to the database.
              $cordovaGeolocation.getCurrentPosition(posOptions)
              .then(function(position) {
                // Redirect to the Exlore Page
                $state.go('tab.explore');
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                // Upload the media with tags to the database, socket connection will populate the map when the media is successfully uploaded
                var mediaFactory = MediaFactory.addMedia(data, 'image', lat, lon, $scope.userInfo.user_id, 'ATX', 0)
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

  // If the user opts to add a video, this method will be called
    $scope.addVideo = function(){
      // Set the time limit for the video and limit the number of videos per upload (no iOS support)
      var options = { limit: 1, duration: 10 };

      // Launch the video-camera with the options that we've defined
      $cordovaCapture.captureVideo(options).then(function(videoData) {
        $rootScope.spinner = true;
        var options = {};
        // Success! Video data is here
        $cordovaFileTransfer.upload('http://phoenixapi.herokuapp.com/api/media/upload/video', videoData[0].fullPath, options)
        .then(function(data){
          // Set the thumbnail Image
          $scope.media.thumb = JSON.parse(data.response).url.slice(0, -3) + 'jpg';
          // Open the upload media modal
          $scope.openModal();
          var posOptions = {timeout: 30000, enableHighAccuracy: true};

          //Get current position and save the url along with geo location to the database.
          $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function(position){
            // Redirect to the explore page
            $state.go('tab.explore');
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            // Upload the media with tags to the database, socket connection will populate the map when the media is successfully uploaded
            var mediaFactory = MediaFactory.addMedia(data, 'video', lat, lon, $scope.userInfo.user_id, 'ATX', 0);
            mediaFactory.then(function(response){
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