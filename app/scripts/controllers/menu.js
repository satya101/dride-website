'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('MenuCtrl', function ($scope) {


  	$scope.closeMenu = function(){
  		$scope.collapse = false;

  	}


  });
