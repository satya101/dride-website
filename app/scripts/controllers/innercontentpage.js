'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:InnercontentpageCtrl
 * @description
 * # InnercontentpageCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('InnercontentpageCtrl', function ($scope, devMenu, $routeParams, $rootScope, $mixpanel) {
  	

  	$scope.sideNav = devMenu.getMenu();

  	console.log($rootScope.currentPage);

  	$scope.pageTtl = $routeParams.pageTtl;


    $scope.trackDownload = function(){
       $mixpanel.track('Download drideOS');
    }

  });
