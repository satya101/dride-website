'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:FeaturesCtrl
 * @description
 * # FeaturesCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('FeaturesCtrl', function ($scope, $http, $mixpanel) {

  	    $scope.preSubmit = true;

        $mixpanel.track('Features visit');

        $scope.video = {
          id: '9Y5fFTuXkMM',
          maxresdefault: 'maxresdefault'
        };


        $scope.sendDetails = function(email){
            console.log(email)
            $http({
                  method: 'GET',
                  url: 'https://getcardigan.com/validator/subscribe.php?email=' + email
            });


            $scope.preSubmit = false;
        }


       $scope.animateElementIn = function($el) {
          $el.addClass('animated fadeInUp'); // this example leverages animate.css classes
        };


  });
