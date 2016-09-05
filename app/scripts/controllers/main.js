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
        
        $scope.video = {
          id: '6sp2wUMysc0'
        };


        //when press prev, card slide to right
        $scope.goToView = function(view) {

            if (view > 6)
              view = 6

            if (view < 1)
              view = 1


            $scope.toLeft = true;
            $scope.toRight = false;

            $scope.displayCard = view;

        };






  });
