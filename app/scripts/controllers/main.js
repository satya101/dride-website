'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('MainCtrl', function ($scope, $http, devMenu) {


        $scope.toLeft = false;
        $scope.toRight = false;
        $scope.showPreOrder = false;
        $scope.preSubmit = true;
        $scope.displayCard = 1;

        $scope.sideNav = devMenu.getMenu();
        

        var md = new MobileDetect(window.navigator.userAgent);
        $scope.video = {
          id: 'F-GzkYJyKpI'
        };

        $scope.email = '';

        $scope.isMobile = md.mobile() || window.innerWidth <= 768;

        $scope.views = ["product", "cloud", "mic", "camera", "wifi", "app", "docs"]
        //when press prev, card slide to right
        $scope.goToView = function(view, strict, addOrSub) {


            view = addOrSub ? (parseInt(view) + addOrSub) : view;
  
            //dont run if popup is there
            if ($scope.showPreOrder)
                return;

            //validate a gap of at least 1 sec to prevent super fast scroll
            var dateNow = new Date().getTime();
            if ($scope.transitionFired && (dateNow - $scope.transitionFired < 1000))
                return;


            if (view > 7)
              view = 7

            if (view < 1)
              view = 1


            $scope.toLeft = true;
            $scope.toRight = false;

            $scope.displayCard = view;
            console.log($scope.displayCard)

            //save the time of the transition to prevent super fast scroll
            $scope.transitionFired = dateNow


        };


        $scope.openPreOrder = function(){
            if ($scope.isMobile)
                $scope.hideNav = true;
            $scope.showPreOrder = true;
        }
        $scope.closePreOrder = function(){
            delete $scope.hideNav;
            $scope.showPreOrder = false;
        }
        $scope.sendDetails = function(email){
            console.log(email)
            $http({
                  method: 'GET',
                  url: 'https://getcardigan.com/validator/subscribe.php?email=' + email
            });


            $scope.preSubmit = false;
        }



  });
