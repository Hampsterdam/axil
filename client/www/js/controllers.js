angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, $cordovaOauth) {
  
  $scope.facebookLogin = function() {
    $cordovaOauth.facebook('1095011603846978', ['email', 'user_friends', 'user_location']).then(function(result) {
      console.log(JSON.stringify(result));
    }, function(error) {
      console.log(error);
    });
  }
});

.controller('DashCtrl', function($scope, $cordovaOauth) {
  $scope.facebookLogin = function() {
    $cordovaOauth.facebook('1095011603846978', ['email', 'user_friends', 'user_location']).then(function(result) {
      console.log(JSON.stringify(result));
    }, function(error) {
      console.log(error);
    });
  }
})

.controller('ChatsCtrl', function($scope, $http) {
  $http.get('http://localhost:9000/api/users')
 .success(function(data){
   $scope.users = data;
 })

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $http) {
  $http.get('http://localhost:9000/api/media')
  .success(function(data){
   $scope.medias = data;
  })
});
