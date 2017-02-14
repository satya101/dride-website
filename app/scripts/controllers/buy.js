'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:BuyCtrl
 * @description
 * # BuyCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('BuyCtrl', function ($scope, $http, $mixpanel) {

        $scope.preSubmit = true;

        $mixpanel.track("buy visited");


        window.location.href = 'https://www.kickstarter.com/projects/1969971763/dride-connected-dashcam-with-safety-alerts-and-app?ref=7wieq3';
 
        $scope.sendDetails = function(email){
            console.log(email)
            $http({
                  method: 'GET',
                  url: 'https://getcardigan.com/validator/subscribe.php?email=' + email
            });


            $scope.preSubmit = false;
        }


  });
