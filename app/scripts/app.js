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
    'swipe'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
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
      .otherwise({
        redirectTo: '/page-not-found'
      });

      $locationProvider.html5Mode(true).hashPrefix('!');
  });
