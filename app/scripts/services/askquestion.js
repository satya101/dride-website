'use strict';

/**
 * @ngdoc service
 * @name drideApp.askQuestion
 * @description
 * # askQuestion
 * Service in the drideApp.
 */
angular.module('drideApp')

.service('askQuestion', function($uibModal, $location, $firebaseArray) {

    return {
        ask: function() {


            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/ask.html',
                controller: ['$uibModalInstance', '$scope', '$firebaseAuth', '$rootScope', '$timeout', 'login', '$mixpanel', function($uibModalInstance, $scope, $firebaseAuth, $rootScope, $timeout, login, $mixpanel) {

                    $scope.isLoaded = false;

                    $uibModalInstance.opened.then(function() {
                        $timeout(function() {
                            $scope.isLoaded = true;
                        }, 500);
                    });



                    $scope.closeModal = function() {
                        $uibModalInstance.close();
                    };


                    $scope.dismissModal = function() {
                        $uibModalInstance.dismiss();
                    };

                    //TODO: Add animation
                    $scope.openThread = function(title) {

                          login.verifyLoggedIn().then(
                               function(result) {

                                    //add a new thread on Firebase
                                    var ref = firebase.database().ref("threads");
                                    var list = $firebaseArray(ref);

                                    list.$add({ 'title': title, 'created': new Date().getTime(), 'views': 0, 'participants': [$rootScope.firebaseUser.uid], 'description': '', 'cmntsCount': 1, 'lastUpdate': (new Date).getTime() }).then(function(ref) {
                                        list[list.$indexFor(ref.key)].slug = $scope.slugify(title, ref.key);
                                        list.$save(list.$indexFor(ref.key)).then(function(ref) {
                                            $scope.closeModal();
                                            //redirect to the thread slug
                                            $location.path('thread/' + $scope.slugify(title, ref.key));

                                            $mixpanel.track('posted a new post');

                                        });


                                    });

                                });



                    };

                    $scope.slugify = function(text, id) {

                        return text
                            .toLowerCase()
                            .replace(/[^\w ]+/g, '')
                            .replace(/ +/g, '-') + '__' + id;;

                    }

                }]
            });

        }

    };

});
