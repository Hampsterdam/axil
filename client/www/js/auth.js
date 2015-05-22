angular.module('axil.authctrl', [])

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 LANDING CONTROLLER                                   //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////
.controller("LandingCtrl", function($scope) {
    
})


/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 LOGIN CONTROLLER                                     //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////


.controller("LoginCtrl", function($scope, $state, $rootScope, $ionicModal, $ionicPlatform, $ionicLoading, $window, AuthFactory, TokenFactory, $cordovaTouchID, Helpers) {


  $ionicPlatform.ready(function() {
    $scope.loginInfo = {};
    $rootScope.authenticated = false;
    $rootScope.userInfo = {};


  // Primary Login Method, uses Auth Factory to send login request to the API
  $scope.login = function() {
    $ionicLoading.show({ template: 'Logging you in...' });
    $rootScope.gravatar = Helpers.get_gravatar($scope.loginInfo.email, 100);
    AuthFactory.login($scope.loginInfo.email, $scope.loginInfo.password)
    .then(function(response){
      // The response will contain a json web token if the login was successful
      if (response.data.token) {
        TokenFactory.deleteToken();
        TokenFactory.setToken(response.data);
        $rootScope.authenticated = true;
        $ionicLoading.hide();
        $state.go('tab.explore')
      } else {
        $scope.loginError = true;
        TokenFactory.deleteToken();
      }
    })
  }
    // Helper function to keep track of login status
    $scope.isError = function() {
      if ($scope.loginError) {
        return true;
      }
      return false;
    }
    
    // Simple logout... delete the token on the client side
    // TODO - delete the server side token as well
    $scope.logout = function() {
      TokenFactory.deleteToken();
      $rootScope.authenticated = false;
      $state.go('/login');
    }

    // If the user wants to sign up, redirect to the signup view
    $scope.signupRedirect = function() {
      $state.go('/signup');
    }
    
  })

})

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 SIGNUP CONTROLLER                                    //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////

.controller("SignupCtrl", function($scope, $rootScope, $state, AuthFactory, TokenFactory, $ionicLoading, $window, $cordovaTouchID, $timeout) {
  $scope.signupInfo = {};
  $scope.signinError = false;
  $rootScope.authenticated = false;

  // Main Signup Method, uses the AuthFactory to create a new user and log the user in with a new session token.
  $scope.signup = function() {
    $ionicLoading.show({ template: 'Signing you up...' });
    AuthFactory.signup($scope.signupInfo.firstname, $scope.signupInfo.lastname, $scope.signupInfo.email, $scope.signupInfo.password)
    .then(function(response) {
      if (response.data.token) {
        TokenFactory.setToken(response.data);
        $rootScope.authenticated = true;
        $ionicLoading.hide();
        $ionicLoading.show({ template: 'Welcome to Axil' });
        $timeout(function(){
          $ionicLoading.hide();
          $state.go("tab.explore");
        },1500);
      } else {
        TokenFactory.deleteToken();
        $scope.signinError = true;
      }
    });
  };

  // Auth Helper Function, not yet in use
  $scope.isError = function() {
    if ($scope.signinError) {
      return true;
    }
    return false;
  }

  // Simple state redirect to login
  $scope.loginRedirect = function() {
    $state.go('/login');
  }

});