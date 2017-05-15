'use strict';

/**
 * @ngdoc service
 * @name drideApp.login
 * @description
 * # login
 * Service in the drideApp.
 */
angular.module('drideApp')
  .service('login', function ($uibModal, Auth, pushNotification) {
    
    return {
		openLogin: function($state){
 

		        var modalInstance = $uibModal.open({
		            animation: true,
		            templateUrl: 'views/modals/login.html',
		            controller: ['$uibModalInstance','$scope', '$firebaseAuth', '$rootScope', '$timeout', '$mixpanel', 'userData', function($uibModalInstance, $scope, $firebaseAuth, $rootScope, $timeout, $mixpanel, userData) {


	                    $scope.isLoaded = false;
	                    $scope.onWelcome = false;
	                    $scope.anonymous = false;

	                    $uibModalInstance.opened.then(function() {
	                        $timeout(function() {
	                            $scope.isLoaded = true;
	                        }, 500);
	                    });


		                $scope.closeModal = function() {
		                    $uibModalInstance.dismiss('cancel');
		                };



		                $scope.connectWithFacebook = function(){

							  var auth = $firebaseAuth();

							  // login with Facebook
							  auth.$signInWithPopup("facebook").then(function(firebaseUser) {
							  	$mixpanel.track('successful login');
							    $rootScope.uid = firebaseUser.user.uid;

							    //ensure push token
						        pushNotification.getPushToken($rootScope.uid)

						        userData($rootScope.uid).$loaded(function(data){
							        if (data.showedAnonymous == true){
								    	$scope.closeModal();
								    }else{
								    	//first time logged in
								    	mixpanel.alias($rootScope.uid)
								    	$scope.onWelcome = true;
								    	firebase.database().ref('userData').child($rootScope.uid).set({ showedAnonymous: true });
								    }

						        });


							  }).catch(function(error) {
							  	$scope.loginError = error.message;
							    //console.log("Authentication failed:", error);
							    //TODO: Show friendly message and log


							  });


		                };


		                $scope.connectWithGoogle = function(){

							  var auth = $firebaseAuth();

							  // login with Facebook
							  auth.$signInWithPopup("google").then(function(firebaseUser) {
							  	$mixpanel.track('successful login');
							    $rootScope.uid = firebaseUser.user.uid;
							    //ensure push token
						        pushNotification.getPushToken($rootScope.uid)
						        
						        userData($rootScope.uid).$loaded(function(data){
							        if (data.showedAnonymous == true){
								    	$scope.closeModal();
								    }else{
								    	//first time logged in
								    	mixpanel.alias($rootScope.uid)
								    	$scope.onWelcome = true;
								    	firebase.database().ref('userData').child($rootScope.uid).update({ showedAnonymous: true });
								    }

						        });

							  }).catch(function(error) {
							  	$scope.loginError = error.message;
							    console.log("Authentication failed:", error);
							    //TODO: Show friendly message and log


							  });


		                };



		                $scope.closeAfterWelcome = function(){

		                	//firebase functions will take it from there..
							firebase.database().ref('userData').child($rootScope.uid).update({ anonymous: $scope.anonymous });
							$scope.closeModal()
		                }


		            }]
		        });

		    },
		logOut: function(){

			firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			  alert('ok!')
			}, function(error) {
			  // An error happened.
			});


		},
		verifyLoggedIn: function(){

			var user = Auth.$getAuth();
			if (!user){
				this.openLogin('');
			}

		}

    };


  });
