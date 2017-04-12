'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:CloudCtrl
 * @description
 * # CloudCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')


  .factory("clipViews", ["$firebaseObject",
    function($firebaseObject) {
      return function(op, vId) {
        // create a reference to the database node where we will store our data
        var viewsRef = firebase.database().ref("clips").child(op).child(vId);

        // return it as a synchronized object
        return $firebaseObject(viewsRef);
      }
    }
  ])

    .controller('CloudCtrl', function($scope, dCloud, $http, login, $rootScope, $mixpanel, $window, clipViews) {


        $scope.replyBox = [];
 		$scope.bindedViews = [];


        $scope.init = function() {
            $scope.hpClips = new dCloud();


        }


        $scope.getRandomPos = function() {
            return Math.random() * 100;
        }


        $scope.loadMoreComments = function(vId, index) {

            var url = "https://dride-2384f.firebaseio.com/conversations_video/40qmIeGnJqdn3rBT9pUSVJIcc6w1/" + vId + ".json";
            $http.jsonp(url).then(function(data) {
                console.log(index)
                var items = data.data;
                $scope.hpClips.items[index].comments = items;
            })

        }

        $scope.hasComments = function(comments) {
            return comments && Object.keys(comments).length ? true : false;
        }

        $scope.hasMoreToLoad = function(currentVideo) {

            if (typeof currentVideo.comments == 'undefined') return false;

            return currentVideo && currentVideo.cmntsCount > Object.keys(currentVideo.comments).length ? true : false;
        }

        $scope.sendComment = function(op, videoId, body, index) {


            if (!body) {
                alert('Please write something');
                return;
            }


            login.verifyLoggedIn();

            firebase.database().ref("conversations_video").child(op).child(videoId).push({
                'autherId': $rootScope.firebaseUser.uid,
                'auther': $rootScope.firebaseUser.displayName,
                'pic': $rootScope.firebaseUser.photoURL,
                'body': body,
                'timestamp': (new Date).getTime()
            }).then(function(){
            	$scope.loadMoreComments(videoId, index);
                body = '';
            	$scope.replyBox[index] = '';

                $scope.bindVideoToLive(op, videoId, index);


            });

            
            $mixpanel.track('posted a comment');



        }


        $scope.fbShare = function(uid, vId) {
            $window.open(
                'https://www.facebook.com/sharer/sharer.php?u=https://dride.io/profile/'+uid+'/'+vId,
                'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + 500 + ',height=' + 600 + ',top=' + ($window.innerHeight - 600) / 2 + ',left=' + ($window.innerWidth - 500) / 2);
        }
        $scope.twShare = function(uid, vId) {
            var url = 'https://dride.io/profile/'+uid+'/'+vId;
            var txt = encodeURIComponent('You need to see this! #dride ' + url);
            $window.open(
                'https://www.twitter.com/intent/tweet?text=' + txt,
                'Twitter', 'toolbar=0,status=0,resizable=yes,width=' + 500 + ',height=' + 600 + ',top=' + ($window.innerHeight - 600) / 2 + ',left=' + ($window.innerWidth - 500) / 2);
        }


        $scope.bindVideoToLive = function(op, vId, index, cmntIncrease) {

            if (typeof $scope.unbindHcp != 'undefined')
                $scope.unbindHcp();

            if (typeof $scope.unbindClip != 'undefined')
                $scope.unbindClip();

            clipViews(op, vId).$bindTo($scope, "hcp").then(function(unbind) {


              if (cmntIncrease)
                  $scope.hcp.views = parseInt($scope.hcp.views) + 1;

              $scope.hpClips.items[index].views = $scope.hcp.views;
              $scope.hpClips.items[index].cmntsCount = $scope.hcp.cmntsCount;
              $scope.unbindClip = unbind;
                
                $scope.unbindHcp = $scope.$watch('hcp', function(){
                    $scope.hpClips.items[index].views = $scope.hcp.views;
                    $scope.hpClips.items[index].cmntsCount = $scope.hcp.cmntsCount;
                });

            });

        }

        $scope.countView = function(op, vId, index) {


            if ($scope.bindedViews[index]) return;

            $scope.bindVideoToLive(op, vId, index, true);

            $scope.bindedViews[index] = true;

        }

    })

// drideCloud constructor function to encapsulate HTTP and pagination logic
.factory('dCloud', function($http) {
    var dCloud = function() {
        this.items = [];
        this.busy = false;
        this.after = 'ZZZZZZZZZZZZZZZZZZZZZZZZ'; //highest key possible
        this.before = '';
        this.end = false;
    };

    dCloud.prototype.nextPage = function() {

        if (this.busy || this.end) return;
        this.busy = true;

        var url = "https://dride-2384f.firebaseio.com/clips/40qmIeGnJqdn3rBT9pUSVJIcc6w1.json?orderBy=%22$key%22&endAt=%22" + this.after + "%22&limitToLast=5";
        $http.jsonp(url).then(function(data) {

            var items = reverseObject(data.data);

            for (var item in items) {
                var config = {
                    'config': {
                        preload: "none",
                        sources: [
                            { src: items[item].clips.src, type: "video/mp4" },
                        ],
                        theme: {
                            url: "styles/videoPlayer.css"
                        },
                        plugins: {
                            controls: {
                                autoHide: true,
                                autoHideTime: 5000
                            },
                            poster: items[item].thumbs.src
                        }
                    }
                }

                item = angular.extend(items[item], config, { videoId: item, op: '40qmIeGnJqdn3rBT9pUSVJIcc6w1' });
                this.items.push(item);
                this.after = Object.keys(items)[Object.keys(items).length - 1];

            }

            this.busy = false;

            if (this.after == this.before) {
                this.end = true;
                return;
            }

            this.before = this.after
            //remove last element because he is the first element from next batch
            this.items.pop();


        }.bind(this));

        function reverseObject(object) {
            var newObject = {};
            var keys = [];
            for (var key in object) {
                keys.push(key);
            }
            for (var i = keys.length - 1; i >= 0; i--) {

                var value = object[keys[i]];
                newObject[keys[i]] = value;
            }

            return newObject;
        }


    };

    return dCloud;
})
