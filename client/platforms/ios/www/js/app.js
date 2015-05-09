// Ionic Phoenix App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'phoenix' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('phoenix', ['ionic', 'phoenix.controllers', 'phoenix.services', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('tab', {
            url:'/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tab.profile', {
            url: '/profile',
            views: {
                "tab-profile": {
                templateUrl: 'templates/tab-profile.html',
                controller: 'ProfileCtrl'
                }
            }
        })
        .state('tab.explore', {
            url: '/explore',
            views: {
                "tab-explore": {
                templateUrl: 'templates/tab-explore.html',
                controller: 'FeedCtrl'
                }
            }
        })
        .state('tab.upload', {
            url: '/upload',
            views: {
                "tab-upload": {
                templateUrl: 'templates/tab-upload.html',
                controller: 'UploadCtrl'
                    
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
    $urlRouterProvider.otherwise('/login');
});

