angular.module('axil.profctrl', [])

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 PROFILE CONTROLLER                                   //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////

// Main controller for the Profile Page
// TODO: Fetch the logged in users info to load their profile and list their uploaded media (with associated data)
// Dynamically spin up profile views for other users if the logged in user wants to view someone else's profile.
.controller('ProfileCtrl', function($scope, UserFactory, MediaFactory, TokenFactory, Helpers) {
  $scope.userInfo = {};
  $scope.userInfo.user_id = TokenFactory.getUserId();

  // Fetch the user's profile information from the database
  UserFactory.getUniqueUser($scope.userInfo.user_id)
  .then(function(data) {

    var user = data.data;
    // Assign the profile information to scope variables
    $scope.userInfo.firstname = user.firstname;
    $scope.userInfo.lastname = user.lastname;
    $scope.userInfo.email = user.email;
    $scope.userInfo.gravatar = Helpers.get_gravatar(user.email, 200);
  });

  // Get the user's media from the database and store it in MediaList
  MediaFactory.getMediaByUser($scope.userInfo.user_id)
  .then(function(data) {
    $scope.userInfo.mediaList = data.data;
  });

  $scope.deleteMedia = function(media_id) {
    MediaFactory.deleteUniqueMedia(media_id);
    MediaFactory.getMediaByUser($scope.userInfo.user_id)
    .then(function(data) {
        $scope.userInfo.mediaList = data.data;
    });
  }
  
});


