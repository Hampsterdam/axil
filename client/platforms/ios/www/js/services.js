angular.module("phoenix.services", [])

.factory("MediaFactory", function($http) {
  
  function getAllMedia() {
    return $http({
      method: "GET",
      url: "http://localhost:9000/api/media"
    }).success(function(data) {
      return data;
    }).error(function(err) {
      return err;
    })
  }

})

.factory("UsersFactory", function($http) {

})

.factory("AuthFactory", function($http) {

})

.factory("TagsFactory", function($http) {

})