'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('MainCtrl', function ($scope) {


        $scope.toLeft = false;
        $scope.toRight = false;
  
        $scope.displayCard = 1;
        
        //when press prev, card slide to right
        $scope.goToView = function(view) {


            $scope.toLeft = true;
            $scope.toRight = false;

            $scope.displayCard = view

        };






  });
