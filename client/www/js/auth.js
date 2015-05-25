angular.module('axil.authctrl', [])

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 LOGIN CONTROLLER                                     //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////


.controller("LoginCtrl", function($scope, $state, $rootScope, $ionicModal, $ionicPlatform, $ionicLoading, $window, $ionicPopup, AuthFactory, TokenFactory, $cordovaTouchID, $timeout, Helpers) {

  $ionicPlatform.ready(function() {
    $scope.loginInfo = {};
    $rootScope.authenticated = false;
    $rootScope.userInfo = {};
    $scope.loginError = false;
    $scope.emailError = false;
    
    // RFC822 Email Validation with Regex
    function isEmail(email){
      return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
    }

    // Primary Login Method, uses Auth Factory to send login request to the API
    $scope.login = function() {
      $scope.loginError = false;
      $ionicLoading.show({ template: 'Logging you in...' });
      if (isEmail($scope.loginInfo.email)) {
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
            TokenFactory.deleteToken();
          }
        })
        .catch(function(){
          $ionicLoading.hide();
          $scope.loginError = true;
        })   
      } else {
        $ionicLoading.hide();
        $scope.loginError = true;
        $timeout(function() {
          $scope.loginError = false;
        }, 1200)
      }
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
      $ionicPopup.confirm({
        title: "Logout",
        template: "Are you sure?"
      }).then(function(res) {
       if(res) {
         TokenFactory.deleteToken();
         $rootScope.authenticated = false;
         $state.go('/login');
       } else {
        console.log('You are not sure');
       }
     })
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
  $scope.signupError = false;
  $rootScope.authenticated = false;
  $scope.emailError = false;

  // RFC822 Email Validation with Regex
  function isEmail(email){
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
  }

  // Main Signup Method, uses the AuthFactory to create a new user and log the user in with a new session token.
  $scope.signup = function() {
    $ionicLoading.show({ template: 'Signing you up...' });

    if (isEmail($scope.signupInfo.email)) {
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
          $scope.signupError = true;
        }
      });
    } else {
      $ionicLoading.hide();
      TokenFactory.deleteToken();
      $scope.emailError = true;
      $timeout(function() {
        $scope.emailError = false;
      }, 1200);
    }
  };

  // Auth Helper Function, not yet in use
  $scope.isError = function() {
    if ($scope.signupError) {
      return true;
    }
    return false;
  }

  // Simple state redirect to login
  $scope.loginRedirect = function() {
    $state.go('/login');
  }

});