'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
  .factory("User", ["$firebaseObject",
    function($firebaseArray) {
      return function(uid) {
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref("userData");
        var userRef = ref.child(uid);

        // return it as a synchronized object
        return $firebaseArray(userRef);
      }
    }
  ])
  .factory("UserDevices", ["$firebaseObject",
    function($firebaseArray) {
      return function(uid) {
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref("devices");
        var userRef = ref.child(uid);

        // return it as a synchronized object
        return $firebaseArray(userRef);
      }
    }
  ])
  .controller('UserCtrl', function ($scope, $rootScope, User, UserDevices, login, pushNotification) {


        login.verifyLoggedIn();
        $scope.email = $rootScope.firebaseUser.email;

  	    User($rootScope.firebaseUser.uid).$bindTo($scope, "userData")

  	    $scope.userDevaices = UserDevices($rootScope.firebaseUser.uid);

  	    pushNotification.havePush()

  	    $scope.resetPassword = function(){


			$rootScope.auth.$sendPasswordResetEmail($scope.email).then(function() {
			  // Email sent.
			  //TODO: pretty message
			  console.log('ok')
			}, function(error) {
			  // An error happened.
			  console.log(error)
			});

  	    }

  	    $scope.saveDetails = function(){

  	    	//update email
  	    	if ($rootScope.firebaseUser.email != $scope.email){
				$rootScope.firebaseUser.updateEmail($scope.email).then(function() {
					alert('Ok')
				  // Update successful.
				}, function(error) {
				  // An error happened.
				  alert(error.message)
				});
  	    	}




  	    }


  });
