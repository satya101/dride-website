'use strict';

/**
 * @ngdoc service
 * @name drideApp.pushNotification
 * @description
 * # pushNotification
 * Service in the drideApp.
 */
angular.module('drideApp')
    .service('pushNotification', function($rootScope) {


    	var messaging;
        var push = {
        	setPushObject: function() {
        		this.messaging = firebase.messaging();
            },
            getPushToken: function(uid) {
            	push.setPushObject();

                this.messaging.requestPermission()
                    .then(function() {
                        console.log('Notification permission granted.');
                        push.getToken(uid)

                    })
                    .catch(function(err) {
                        console.log(err);
                        console.log('Unable to get permission to notify.', err);
                    });


            },
            onPushRecieved: function() {

            	push.setPushObject();

				this.messaging.onMessage(function(payload) {
                  // TODO: add internal messaging 
				  console.log("Message received. ", payload);
				  // ...
				});



            },
            havePush: function() {
                $rootScope.FCM = false;
                
                if (!this.messaging)
                    this.setPushObject()

                this.messaging.requestPermission()
                    .then(function() {
                        $rootScope.FCM = true;

                    })
                    .catch(function(err) {
                        $rootScope.FCM = false;
                    });

            },
            getToken: function(uid) {

 
                // Get Instance ID token. Initially this makes a network call, once retrieved
                // subsequent calls to getToken will return from cache.
                this.messaging.getToken()
                    .then(function(currentToken) {
                        if (currentToken) {
                        	//update DB with user token
                        	  firebase.database().ref('pushTokens/' + uid).set({
							    value: currentToken
							  });

                        } else {
                            // Show permission request.
                            console.log('No Instance ID token available. Request permission to generate one.');

                        }
                    })
                    .catch(function(err) {
                        console.log('An error occurred while retrieving token. ', err);
                    });
            }


        };

        return push;
    });
