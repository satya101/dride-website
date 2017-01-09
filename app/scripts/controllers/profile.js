'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')

    .factory("currentVideo", ["$firebaseObject",
      function($firebaseObject) {
        return function(uid, videoId) {
          // create a reference to the database node where we will store our data
          var ref = firebase.database().ref("clips");
          var clipRef = ref.child(uid).child(videoId)

          // return it as a synchronized object
          return $firebaseObject(clipRef)
        }
      }
    ])
  .controller('ProfileCtrl', function ($scope, $uibModal, $rootScope, $routeParams, $firebaseObject, $firebaseArray, currentVideo) {

    $scope.initProfile = function() {

        $scope.uid = $routeParams.uid;
        $scope.videoId = $routeParams.videoId;
        var ref = firebase.database().ref();
        $scope.clips = $firebaseObject(ref.child('clips').child($routeParams.uid)).$loaded()
                          .then(function(data) {
                               //order clips by date
                               $scope.orderedClips = $scope.orderClipsByDate(data);
                          })
                          .catch(function(error) {
                            console.error("Error:", error);
                          });



        var cVideoRef = currentVideo($scope.uid, $scope.videoId);
        
        cVideoRef.$loaded()
                      .then(function(data) {
                            $scope.createVideoObj(data.clips.src, data.thumbs.src)
                      })
                      .catch(function(error) {
                        console.error("Error:", error);
                      });

        cVideoRef.$bindTo($scope, "currentVideo").then(function(){

            $scope.currentVideo.views = $scope.currentVideo.views!=undefined ? parseInt($scope.currentVideo.views) + 1 : 0;

        });

        
    }



    //create the video object for videogular
    $scope.createVideoObj = function(clipURL, posterURL){

        $scope.config = {
            preload: "none",
            sources: [
                {src: clipURL, type: "video/mp4"},
            ],
            theme: {
                url: "styles/videoPlayer.css"
            },
            plugins: {
                    controls: {
                        autoHide: true,
                        autoHideTime: 5000
                    },
                    poster: posterURL
                }
        };
    }

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



    $scope.orderClipsByDate = function(clips){
        var clipsBydate = {};

        angular.forEach(clips, function(value, key) {
            var d = new Date(key*1000);
            var iKey = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
            
            if (!clipsBydate[iKey])
                clipsBydate[iKey] = {};

            clipsBydate[iKey][key] = value;
        });

        return clipsBydate;
    }


    $scope.editClip = function(){

    	if ($rootScope.uid){

    		alert('edit');

    	}
    	else
    		$scope.openLogin();

    }

    $scope.likeClip = function(){

        if ($rootScope.uid){

            alert('like');

        }
        else
            $scope.openLogin();

    }

    $scope.preatifyDate = function(date){
        var exp = date.split('-');
        var d = new Date(exp[2], exp[1], exp[0], 0, 0, 0, 0);
       
        return d;

    }




  });
