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

  	$scope.init = function(){
  		console.log($scope.carouselIndex1)

	}
		$scope.product1 = [
			{
				id : 1,
				url : 'images/product/render.1.png',

			},
			{
				id : 2,
				url : 'images/product/render.2.png',

			},
			{
				id : 3,
				url : 'images/product/render.3.png',

			},
			{
				id : 4,
				url : 'images/product/render.4.png',

			},
			{
				id : 5,
				url : 'images/product/render.5.png',

			}
		];

		$scope.product2 = [
			{
				id : 0,
				url : 'images/cloud.png',

			}
		];

		$scope.product3 = [
			{
				id : 1,
				url : 'images/product/render.1.png',

			},
			{
				id : 2,
				url : 'images/product/render.2.png',

			},
			{
				id : 3,
				url : 'images/product/render.3.png',

			},
			{
				id : 4,
				url : 'images/product/render.4.png',

			},
			{
				id : 5,
				url : 'images/product/render.5.png',

			}
		];

	

  });
