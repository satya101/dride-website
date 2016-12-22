'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:DocumentationCtrl
 * @description
 * # DocumentationCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('DocumentationCtrl', function ($scope, devMenu, $rootScope, $timeout) {

	$scope.show = false;
  	$scope.sideNav = devMenu.getMenu();

  	$scope.showDevMenu = function(){
  		$scope.show = true;
  	}

	$timeout(function(){
		$scope.show = true;
	}, 100);  

  }).directive('editPage',function($rootScope){
     return function(scope, element, attrs){
          element.prepend('<div class="editDocsLabel"><a href="https://github.com/dride/dride-website/blob/master/app/views/content/'+($rootScope.currentPage.split('/'))[2]+'.html">Edit</a></div>')

      }
})
