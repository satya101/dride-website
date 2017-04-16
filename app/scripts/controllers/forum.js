'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:ForumCtrl
 * @description
 * # ForumCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
.factory("threads", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database where we will store our data
        // TODO: pagination
        var ref = firebase.database().ref('threads');

        return $firebaseArray(ref);
    }
])

.controller('ForumCtrl', function($scope, askQuestion, threads, pushNotification, $rootScope) {



    $scope.newPosts = 1;

	$scope.initForum = function(){

		$scope.threads = threads;
        // Retrieve Firebase Messaging object.
        console.log($rootScope.firebaseUser)
        if ($rootScope.firebaseUser.uid)
            $scope.ensurePushToken($rootScope.firebaseUser.uid)
        		
	}



    $scope.ensurePushToken = function(uid){
        pushNotification.getPushToken(uid)
    }

    $scope.ask = function() {
        askQuestion.ask();
    }

    $scope.openThred = function() {
        askQuestion.openThred();
    }


})
.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
})