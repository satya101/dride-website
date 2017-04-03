'use strict';

/**
 * @ngdoc function
 * @name drideApp.controller:UploadtocloudCtrl
 * @description
 * # UploadtocloudCtrl
 * Controller of the drideApp
 */
angular.module('drideApp')
    .controller('UploadtocloudCtrl', function($scope, $rootScope, $location) {

    		$scope.uploadStarted = false;

            $scope.handleFileSelect = function(evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files; // FileList object; // FileList object.

                var file = files[0];

                // Create the file metadata
                var metadata = {
                    contentType: file.type
                };

                var storageRef = firebase.storage().ref();


                // Upload file and metadata to the object 'images/mountains.jpg'
                $scope.timestamp = (new Date).getTime();
                var extensions = file.name.split('.')
                var filename = $scope.timestamp + '.' + extensions[extensions.length - 1];



                if ( (extensions[extensions.length - 1]).toLowerCase() != 'mp4'){
                	alert('bad ' + extensions[extensions.length - 1].toLowerCase())
                	return;
                }

                var uploadTask = storageRef.child('clips/' + $rootScope.firebaseUser.uid + '/' + filename ).put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                    	$scope.uploadStarted = true;
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + $scope.progress + '% done');
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                        }

                        $scope.$apply();
                    },
                    function(error) {

                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;

                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    function() {
                        // Upload completed successfully, now we can get the download URL
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        //push to db
                          firebase.database().ref('clips/' + $rootScope.firebaseUser.uid + '/' + $scope.timestamp).set({
                            clips: {'src': downloadURL},
                            thumbs: {'src': 'http://localhost:9000/images/profile/10.jpg'},
                            views: 0
                          });
                        

                    });



            }


            $scope.init = function(){




		            // Setup the dnd listeners.
		            var dropZone = document.getElementById('drop_zone');

		            dropZone.addEventListener('dragleave', function(e) {

		                dropZone.classList.remove("hoveredFile");

					});

		            dropZone.addEventListener('dragenter', function(e) {
		                dropZone.classList.add("hoveredFile");
					});

		            dropZone.addEventListener('dragover', function(e) {
						dropZone.classList.add("hoveredFile");
		                e.stopPropagation();
		                e.preventDefault();
					})

		            dropZone.addEventListener('drop', function(e) {
		                dropZone.classList.remove("hoveredFile");
		                $scope.handleFileSelect(e);
					});
					
					document.getElementById('files').addEventListener('change',  function(e) {
		                dropZone.classList.remove("hoveredFile");
		                console.log(e)
		                $scope.handleFileSelect(e);
					}, false);



        	}


        	$scope.openUploadBox = function(){
        		document.getElementById("files").click();
        	}
        


            $scope.publishClip = function(){


                //push meta to DB
                  firebase.database().ref('clips/' + $rootScope.firebaseUser.uid + '/' + $scope.timestamp).update({
                    description: $scope.description,
                    plates: $scope.plates,
                    location: ''//$scope.location
                  });


                $location.path('profile/' + $rootScope.firebaseUser.uid + '/' + $scope.timestamp);

            }








    });
