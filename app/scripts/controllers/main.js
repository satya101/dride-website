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
        
        //when press prev, card slide to left
        $scope.prev = function() {
          $scope.toLeft = true;
          $scope.toRight = false;
          if ($scope.displayCard == 1) {
            $scope.displayCard = 3
          } else {
            $scope.displayCard -= 1;
          }
        };
        
        //when press prev, card slide to right
        $scope.next = function() {
          $scope.toLeft = false;
          $scope.toRight = true;
  
          if ($scope.displayCard == 3) {
            $scope.displayCard = 1
          } else {
            $scope.displayCard += 1;
          }
        };





  });
