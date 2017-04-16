"use strict";

/**
 * @ngdoc function
 * @name drideApp.controller:ForumCtrl
 * @description
 * # ForumCtrl
 * Controller of the drideApp
 */
angular
    .module("drideApp")
    .factory("threads", [
        "$firebaseArray",
        function($firebaseArray) {
            // create a reference to the database where we will store our data
            // TODO: pagination
            var ref = firebase.database().ref("threads");

            return $firebaseArray(ref);
        }
    ])
    .controller("ForumCtrl", function(
        $scope,
        askQuestion,
        threads,
        pushNotification,
        $rootScope
    ) {
        $scope.newPosts = 1;

        $scope.initForum = function() {
            $scope.threads = threads;

            // Retrieve Firebase Messaging object.
            if ($rootScope.uid) pushNotification.getPushToken($rootScope.uid);
        };

        $scope.ask = function() {
            askQuestion.ask();
        };

        $scope.openThred = function() {
            askQuestion.openThred();
        };
    })
    .filter("reverse", function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .filter("cut", function() {
        return function(value, wordwise, max, tail) {
            if (!value) return "";

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(" ");
                if (lastspace !== -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (
                        value.charAt(lastspace - 1) === "." ||
                        value.charAt(lastspace - 1) === ","
                    ) {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || " …");
        };
    });
