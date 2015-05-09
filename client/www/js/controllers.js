angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
