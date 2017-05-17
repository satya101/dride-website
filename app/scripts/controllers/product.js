'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('ProductCtrl', function ($scope, $http, $routeParams, $location, login, $mixpanel, payment) {



  	$scope.init = function(){
  			var key = $routeParams.productName;
  		    var url = "https://dride-2384f.firebaseio.com/content/"+key+".json";
            $http.jsonp(url).then(function(data) {
                $scope.data = data.data

                //redirect if product was not found
                if (!$scope.data)
                	$location.path('404')


                $scope.mainPic = data.data.images[0].url
                



            });

          $mixpanel.track('product visit');
  	}

  	$scope.updateMainPicture = function(i){
		$scope.mainPic = $scope.data.images[i].url
  	}

  	$scope.purchase =function(){


  		login.verifyLoggedIn().then(
            function (result) {
              
                  payment.makePayment($scope.data.price, $scope.data.key, $scope.data.actionBtn)
                
              })

  	}



  });
