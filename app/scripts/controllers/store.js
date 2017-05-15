'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:StoreCtrl
 * @description
 * # StoreCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('StoreCtrl', function ($scope) {

		$scope.pType = function(){
			return window.innerWidth <= 991 ? 2 : 1;
		}
		

  });
