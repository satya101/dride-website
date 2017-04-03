'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:ForumThreadCtrl
 * @description
 * # ForumThreadCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')

  .factory("Thread", ["$firebaseObject",
    function($firebaseArray) {
      return function(threadId) {
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref("threads");
        var threadRef = ref.child(threadId);

        // return it as a synchronized object
        return $firebaseArray(threadRef);
      }
    }
  ])

  .factory("Conversation", ["$firebaseObject",
    function($firebaseObject) {
      return function(threadId) {
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref("conversations");
        var conversationRef = ref.child(threadId);

        // return it as a synchronized object
        return $firebaseObject(conversationRef);
      }
    }
  ])

  .controller('ForumThreadCtrl', function ($scope, Thread, $routeParams, Conversation, $rootScope, $mixpanel) {

      $scope.initThread = function(){
        //if we dont have an thread Id redirect to forum main page
        if (typeof $routeParams.threadId === "undefined"){
          $location.path('forum');
          return;
        }
        //break the routeParam and get the last element after the '__' chars
        $scope.currentThread = Thread($routeParams.threadId.split('__').pop());

        //load three way binding for the conversation bubbles
        Conversation($routeParams.threadId.split('__').pop()).$bindTo($scope, "conversation").then(function() {

            $scope.conversationPreviusIsMine = [];
            $scope.$watch(
                "conversation",
                function handleUpdate( newValue, oldValue ) {
                     if (typeof $scope.conversation !== "undefined")
                        $scope.sideThreadByAuther($scope.conversation);
                }
            );


        });


      }

      $scope.sideThreadByAuther = function(threadData) {


          if (typeof threadData === "undefined")
              return;

          var previusKey = null;
          angular.forEach(threadData, function(k, key) {
              if (key == '$id' || key== '$priority')
                return;

              if (!previusKey) {
                  previusKey = key;
                  return;
              }
              //if same author posted again
              if (threadData[key].autherId == threadData[previusKey].autherId) {
                  $scope.conversationPreviusIsMine[previusKey] = true;
              } else {
                  $scope.conversationPreviusIsMine[previusKey] = false;
              }
              previusKey = key;
          });

         
      }

      $scope.send = function(){

         firebase.database().ref("conversations").child($routeParams.threadId.split('__').pop()).push({
              'autherId': $rootScope.firebaseUser.uid,
              'auther': $rootScope.firebaseUser.displayName,
              'pic': $rootScope.firebaseUser.photoURL,
              'body': $scope.replyBox,
              'timestamp': (new Date).getTime()
          });

          $scope.replyBox = '';
          $mixpanel.track('posted a comment');



      }


  })
  .directive('elastic', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function($scope, element) {
                    $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                    var resize = function() {
                        element[0].style.height = $scope.initialHeight;
                        element[0].style.height = "" + element[0].scrollHeight + "px";
                    };
                    element.on("input change", resize);
                    $timeout(resize, 0);
                }
            };
        }
    ])
    .directive('ctrlEnter', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
         
          elem.bind('keydown', function(event) {
            var code = event.keyCode || event.which;
            if (code === 13) {
              if (event.ctrlKey) {
                event.preventDefault();
                scope.$apply(attrs.ctrlEnter);
              }
            }
          });
        }
      }
    })


