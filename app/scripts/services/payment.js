'use strict';

/**
 * @ngdoc service
 * @name drideApp.payment
 * @description
 * # payment
 * Service in the drideApp.
 */
angular.module('drideApp')
  .service('payment', function ($uibModal, $q) {


		var deferred = $q.defer();
  		this.makePayment =  function(price, productId, isPreOrder){


		        var modalInstance = $uibModal.open({
		            animation: true,
		            templateUrl: 'views/modals/payment.html',
		            controller: ['$uibModalInstance','$scope', '$mixpanel', '$window', '$rootScope', function($uibModalInstance, $scope, $mixpanel, $window, $rootScope) {


	                    $scope.isLoaded = false;
	                    $scope.onWelcome = false;
	                    $scope.anonymous = false;
						$scope.shareTxt = "I've just entered the queue for #dride and you should too 🚗";

						

		                $scope.init = function() {
		                	$mixpanel.track('opened buy for ' + productId);
		                	firebase.database().ref('queue/' + $rootScope.firebaseUser.uid + '/email').set($rootScope.firebaseUser.email)
		                	firebase.database().ref('queue/' + $rootScope.firebaseUser.uid + '/date').push({dte: (new Date).getTime()})
		                }

		                $scope.closeModal = function() {
		                    $uibModalInstance.close();
		                };


		                $scope.dismissModal = function() {
		                    $uibModalInstance.dismiss();
		                };

		                $scope.pay = function(){

		                	alert('ok')

		                };

						$scope.tweet = function() {

						    var urlString = 'https://www.twitter.com/intent/tweet?';
						    urlString += 'text=' + encodeURIComponent($scope.shareTxt);
						    urlString += '&hashtags=' + encodeURIComponent('dride #connected_dashcam');

						    //default to the current page if a URL isn't specified
						    urlString += '&url=' + encodeURIComponent('https://dride.io/store');

						    $window.open(
						        urlString,
						        'Twitter', 'toolbar=0,status=0,resizable=yes,width=500,height=600,top=' + ($window.innerHeight - 600) / 2 + ',left=' + ($window.innerWidth - 500) / 2);
						    $mixpanel.track('twitted from store');

						}







		            }]



		        });

		        //return promise
		        return modalInstance.result




  		}






  });
