angular.module('axil', ['ionic', 'axil.authctrl', 'axil.profctrl', 'axil.uploadctrl', 'axil.explorectrl', 'axil.services', 'axil.constants', 'ngCordova'])

// Set up socket.io connection with the server
.run(function($ionicPlatform, Socket) {
  Socket.emit('connection', function(){
    console.log("socket connected to server");
  })
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

// Filter to allow us to load videos from the cloud storage
// This is to comply with the AngularJS Security Policy
.filter('trusted', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
})

// State Provider Config, associates tabs with Views (www/templates/..) and Controllers (controllers.js)
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Load the HTTP interceptor from services.js to modify requests to locked API routes.
  // The functionality of the interceptor is explained where it is defined.
  $httpProvider.interceptors.push('Interceptor');

  $stateProvider
  .state('/login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('/signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tab.explore', {
    url: '/explore',
    views: {
      'tab-explore': {
        templateUrl: 'templates/tab-explore.html',
        controller: 'ExploreCtrl'
      }
    }
  })
  .state('tab.camera', {
      url: '/camera',
      views: {
        'tab-camera': {
          templateUrl: 'templates/tab-camera.html',
          controller: 'AddMediaCtrl'
        }
      }
  })
  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // Redirect to Login otherwise
  $urlRouterProvider.otherwise('/login');
});

