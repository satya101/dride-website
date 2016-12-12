'use strict';

/**
 * @ngdoc overview
 * @name drideApp
 * @description
 * # drideApp
 *
 * Main module of the application.
 */
angular
  .module('drideApp', [
    'ngAnimate',
    'ngRoute',
    'angularVideoBg',
    'swipe',
    'ui.bootstrap',
    'firebase',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
  ])
  .config(function ($routeProvider, $locationProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/**'
    ]);


    $routeProvider
      .when('/profile/:uid/:videoId', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl',
      //   controllerAs: 'main'
      // })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/page-not-found', {
        templateUrl: 'views/page-not-found.html',
        controller: 'PageNotFoundCtrl',
        controllerAs: 'pageNotFound'
      })
      .when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'blog'
      })
      .when('/features', {
        templateUrl: 'views/features.html',
        controller: 'FeaturesCtrl',
        controllerAs: 'features'
      })
      .when('/docs', {
        templateUrl: 'views/docs.html',
        controller: 'DocsCtrl',
        controllerAs: 'docs'
      })
      .when('/documentation', {
        templateUrl: 'views/documentation.html',
        controller: 'DocumentationCtrl',
        controllerAs: 'documentation'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .otherwise({
        redirectTo: '/page-not-found'
      });

      //$locationProvider.html5Mode(true).hashPrefix('!');
  });
