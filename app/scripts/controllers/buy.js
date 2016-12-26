'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:BuyCtrl
 * @description
 * # BuyCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('BuyCtrl', function ($scope, $http) {

        $scope.preSubmit = true;


        $scope.sendDetails = function(email){
            console.log(email)
            $http({
                  method: 'GET',
                  url: 'https://getcardigan.com/validator/subscribe.php?email=' + email
            });


            $scope.preSubmit = false;
        }


  });
