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

.controller('ForumCtrl', function($scope, askQuestion, threads) {



    $scope.newPosts = 1;

	$scope.initForum = function(){

		$scope.threads = threads;
		
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