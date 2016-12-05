'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .controller('ProfileCtrl', function ($scope, $uibModal, $rootScope) {


    $scope.openLogin = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/login.html',
            controller: ['$uibModalInstance','$scope', '$firebaseAuth', '$rootScope', function($uibModalInstance, $scope, $firebaseAuth, $rootScope) {


                $scope.closeModal = function() {

                    $uibModalInstance.dismiss('cancel');
                };



                $scope.connectWithFacebook = function(){

					  var auth = $firebaseAuth();

					  // login with Facebook
					  auth.$signInWithPopup("facebook").then(function(firebaseUser) {
					    // console.log("Signed in as:", firebaseUser.user.uid);
					    // console.log("Signed in as:", firebaseUser.user.email);
					    $rootScope.uid = firebaseUser.user.uid;
					    $scope.closeModal();

					  }).catch(function(error) {
					    console.log("Authentication failed:", error);
					    //TODO: Show friendly message and log


					  });


                }

            }]
        });

    }



  });
