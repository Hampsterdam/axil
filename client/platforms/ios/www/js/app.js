angular.module('axil', ['ionic', 'axil.controllers', 'axil.services', 'axil.constants', 'ngCordova'])

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
// .config(function($httpProvider){
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
// })

// State Provider Config, associates tabs with Views (www/templates/..) and Controllers (controllers.js)
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.interceptors.push('Interceptor');
  $stateProvider
  .state('/', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
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

