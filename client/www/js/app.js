angular.module('phoenix', ['ionic', 'phoenix.controllers', 'phoenix.services', 'ngCordova'])

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

// State Provider Config, associates tabs with Views (www/templates/..) and Controllers (controllers.js)
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.auth', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('tab.signup', {
    url: '/signup',
    views: {
      'tab-signup': {
        templateUrl: 'templates/tab-signup.html',
        controller: 'SignUpCtrl'
      }
    }
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
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'AddMediaCtrl'
        }
      }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // Redirect to Login otherwise
  $urlRouterProvider.otherwise('/tab/login');

});

