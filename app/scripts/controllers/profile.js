"use strict";

/**
 * @ngdoc function
 * @name drideApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the drideApp
 */
angular
    .module("drideApp")
    .factory("currentVideo", [
        "$firebaseObject",
        function($firebaseObject) {
            return function(uid, videoId) {
                if (!uid || !videoId) {
                    return;
                }
                // create a reference to the database node where we will store our data
                var ref = firebase.database().ref("clips");
                var clipRef = ref.child(uid).child(videoId);

                // return it as a synchronized object
                return $firebaseObject(clipRef);
            };
        }
    ])
    .factory("getRandomVideo", [
        "$firebaseArray",
        function($firebaseArray) {
            return function(uid, videoId) {
                // create a reference to the database node where we will store our data
                var ref = firebase.database().ref("clips");
                var clipRef = ref.child(uid).limitToLast(1);

                // return it as a synchronized object
                return $firebaseArray(clipRef);
            };
        }
    ])
    .factory("userData", [
        "$firebaseObject",
        function($firebaseObject) {
            return function(uid) {
                // create a reference to the database node where we will store our data
                var ref = firebase.database().ref("userData");
                var clipRef = ref.child(uid);

                // return it as a synchronized object
                return $firebaseObject(clipRef);
            };
        }
    ])
    .controller("ProfileCtrl", function(
        $scope,
        $uibModal,
        $rootScope,
        $routeParams,
        $firebaseObject,
        $firebaseArray,
        currentVideo,
        $mixpanel,
        login,
        $window,
        $http,
        userData,
        getRandomVideo,
        $location,
        uiGmapGoogleMapApi
    ) {
        $scope.initProfile = function() {
            $mixpanel.track("Videos visit");


            $scope.map = {
                stroke: {
                    "color": "#6060FB",
                    "weight": 4
                },
                zoom: 16
            };



            $scope.userHaveNoVideos = false;
            $scope.videoRoute = [];
            $scope.uid = $routeParams.uid;
            if (typeof $routeParams.videoId == "undefined") {
                var url =
                    "https://dride-2384f.firebaseio.com/clips/" +
                    $scope.uid +
                    '.json?limitToLast=1&orderBy="$key"';
                $http.jsonp(url).then(function(data) {
                    if (data.data) {
                        $location.path(
                            "profile/" +
                                $scope.uid +
                                "/" +
                                Object.keys(data.data)[0]
                        );
                    } else {
                        $scope.userHaveNoVideos = true;
                    }
                });
            } else {
                $scope.videoId = $routeParams.videoId;

                $scope.comments = {};
                var ref = firebase.database().ref();
                $scope.clips = $firebaseObject(
                    ref.child("clips").child($scope.uid)
                )
                    .$loaded()
                    .then(function(data) {
                        //order clips by date
                        $scope.orderedClips = $scope.orderClipsByDate(data);
                    })
                    .catch(function(error) {
                        console.error("Error:", error);
                    });

                var cVideoRef = currentVideo($scope.uid, $scope.videoId);

                cVideoRef
                    .$loaded()
                    .then(function(data) {
                        $scope.createVideoObj(data.clips.src, data.thumbs.src);
                        $scope.comments = data.comments;
                        //load gps location
                        if (!data.gps)
                            return;
                        
                        $http({
                            url: data.gps.src,
                            method: "GET"
                        })
                            .then(function(data) {
                                var s = $scope.prepGeoJsonToGoogleMaps(
                                    data.data
                                );
                                var middleRoad = Math.ceil(s.length / 2)
                                $scope.map['center'] = {latitude: s[middleRoad].latitude, longitude: s[middleRoad].longitude};
                                $scope.map['path'] = s;
                                
                            })
                            .catch(function(e) {
                                console.log(e);
                            });
                    })
                    .catch(function(error) {
                        console.error("Error:", error);
                    });

                cVideoRef.$bindTo($scope, "currentVideo").then(function() {
                    $scope.currentVideo.views = $scope.currentVideo.views !=
                        undefined
                        ? parseInt($scope.currentVideo.views) + 1
                        : 0;
                });
            }

            $scope.opData = userData($scope.uid);
        };

        //create the video object for videogular
        $scope.createVideoObj = function(clipURL, posterURL) {
            $scope.config = {
                preload: "none",
                sources: [{ src: clipURL, type: "video/mp4" }],
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
        };

        $scope.openLogin = function() {
            login.openLogin("profile/" + $scope.videoId);
        };

        $scope.sideThreadByAuther = function(threadData) {
            if (typeof threadData === "undefined") return;

            var previusKey = null;
            angular.forEach(threadData, function(k, key) {
                if (key == "$id" || key == "$priority") return;

                if (!previusKey) {
                    previusKey = key;
                    return;
                }
                //if same author posted again
                if (
                    threadData[key].autherId == threadData[previusKey].autherId
                ) {
                    $scope.conversationPreviusIsMine[previusKey] = true;
                } else {
                    $scope.conversationPreviusIsMine[previusKey] = false;
                }
                previusKey = key;
            });
        };

        $scope.orderClipsByDate = function(clips) {
            var clipsBydate = {};

            angular.forEach(clips, function(value, key) {
                var d = new Date(key * 1000);
                var iKey =
                    d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();

                if (!clipsBydate[iKey]) clipsBydate[iKey] = {};

                clipsBydate[iKey][key] = value;
            });

            return clipsBydate;
        };

        $scope.editClip = function() {
            if ($rootScope.uid) {
                alert("edit");
            } else $scope.openLogin();
        };
        //TODO: infinite scroll would be nice
        $scope.loadMoreComments = function(vId) {
            var url =
                "https://dride-2384f.firebaseio.com/conversations_video/40qmIeGnJqdn3rBT9pUSVJIcc6w1/" +
                vId +
                ".json";
            $http.jsonp(url).then(function(data) {
                var items = data.data;
                $scope.comments = items;

                $scope.conversationPreviusIsMine = [];
                $scope.$watch("comments", function handleUpdate(
                    newValue,
                    oldValue
                ) {
                    if (typeof $scope.comments !== "undefined")
                        $scope.sideThreadByAuther($scope.comments);
                });
            });
        };

        $scope.hasComments = function(comments) {
            return comments && Object.keys(comments).length ? true : false;
        };

        $scope.hasMoreToLoad = function() {
            if (!$scope.comments || typeof $scope.comments == "undefined")
                return false;

            return $scope.currentVideo &&
                $scope.currentVideo.cmntsCount >
                    Object.keys($scope.comments).length
                ? true
                : false;
        };

        $scope.sendComment = function() {

            if (!document.getElementById("replyBox").value) {
                alert("Please write something");              
                return;
            }

            login.verifyLoggedIn();

            firebase
                .database()
                .ref("conversations_video")
                .child($scope.uid)
                .child($scope.videoId)
                .push({
                    autherId: $rootScope.firebaseUser.uid,
                    auther: $rootScope.firebaseUser.displayName,
                    pic: $rootScope.firebaseUser.photoURL,
                    body: document.getElementById("replyBox").value,
                    timestamp: new Date().getTime()
                })
                .then(function() {
                    $scope.loadMoreComments($scope.videoId);
                    //TODO: figure why $scope.replyBox is not working..
                    document.getElementById("replyBox").value = '';
                });

            $mixpanel.track("posted a comment");
        };

        $scope.fbShare = function(uid, vId) {
            $window.open(
                "https://www.facebook.com/sharer/sharer.php?u=https://dride.io/profile/" +
                    uid +
                    "/" +
                    vId,
                "Facebook",
                "toolbar=0,status=0,resizable=yes,width=" +
                    500 +
                    ",height=" +
                    600 +
                    ",top=" +
                    ($window.innerHeight - 600) / 2 +
                    ",left=" +
                    ($window.innerWidth - 500) / 2
            );
        };
        $scope.twShare = function(uid, vId) {
            var url = "https://dride.io/profile/" + uid + "/" + vId;
            var txt = encodeURIComponent("You need to see this! #dride " + url);
            $window.open(
                "https://www.twitter.com/intent/tweet?text=" + txt,
                "Twitter",
                "toolbar=0,status=0,resizable=yes,width=" +
                    500 +
                    ",height=" +
                    600 +
                    ",top=" +
                    ($window.innerHeight - 600) / 2 +
                    ",left=" +
                    ($window.innerWidth - 500) / 2
            );
        };

        $scope.preatifyDate = function(date) {
            var exp = date.split("-");
            var d = new Date(exp[2], exp[1], exp[0], 0, 0, 0, 0);

            return d;
        };

        $scope.prepGeoJsonToGoogleMaps = function(geoJson) {
            var videoRoute = [];
            Object.keys(geoJson).forEach(function(key) {
                geoJson[key] = JSON.parse(geoJson[key]);

                videoRoute.push({
                    latitude: geoJson[key].latitude * -1,
                    longitude: geoJson[key].longitude * -1
                });


            });

            return videoRoute;
        };


        $scope.removeClip = function(uid, vId) {

            //TODO: promt before remove

            //firebase functions will take it from here..
            firebase.database().ref('clips').child(uid).child(vId).update({
                'deleted': true
            });

            $location.path('profile/' + uid)

        };

        $scope.commentFoucs = function(){

            document.getElementById("replyBox").focus();

        }

    });
