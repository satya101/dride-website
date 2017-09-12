import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

// remove this when we will have native storage wrapper
// https://github.com/angular/angularfire2/issues/241
import * as firebase from 'firebase/app'; // for typings
import { FirebaseApp } from 'angularfire2';

@Component({
	selector: 'app-upload-video',
	templateUrl: './upload-video.component.html',
	styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {

	public uploadStarted = false
	public timestamp: any
	public process = 0
	public firebaseUser: any;
	public plates: any;
	public description: any;
	public progress: any;

	constructor(private db: AngularFireDatabase,
		public af: AngularFireDatabase,
		private auth: AuthService,
		private afAuth: AngularFireAuth,
		private router: Router,
		public firebaseApp: FirebaseApp) {


		// get Auth state
		afAuth.authState.subscribe(user => {
			if (!user) {
				this.firebaseUser = null;
			} else {
				this.firebaseUser = user;
			}

		});



	}

	handleFileSelect = function (evt) {
		this.auth.verifyLoggedIn().then(() => {
			evt.stopPropagation();
			evt.preventDefault();

			const files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files; // FileList object; // FileList object.

			const file = files[0];
			// Create the file metadata
			const metadata = {
				contentType: file.type
			};

			const storageRef = this.firebaseApp.storage().ref();


			// Upload file and metadata to the object 'images/mountains.jpg'
			this.timestamp = parseInt((new Date).getTime() / 1000 + '');
			const extensions = file.name.split('.')
			const filename = this.timestamp + '.' + extensions[extensions.length - 1];



			if ((extensions[extensions.length - 1]).toLowerCase() !== 'mp4') {
				alert('bad ' + extensions[extensions.length - 1].toLowerCase())
				return;
			}

			const uploadTask = storageRef.child('clips/' + this.firebaseUser.uid + '/' + filename).put(file, metadata)

			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on('state_changed', (snapshot) => {
				this.uploadStarted = true;
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				this.progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '');
				console.log('Upload is ' + this.progress + '% done');

			},
				(error) => {

					// A full list of error codes is available at
					// https://firebase.google.com/docs/storage/web/handle-errors
					switch (error.code) {
						case 'storage/unauthorized':
							// User doesn't have permission to access the object
							console.error(error.code)
							break;

						case 'storage/canceled':
							// User canceled the upload
							console.error(error.code)
							break;

						case 'storage/unknown':
							// Unknown error occurred, inspect error.serverResponse
							console.error(error.code)
							break;
					}
				},
				() => {
					// Upload completed successfully, now we can get the download URL
					const downloadURL = uploadTask.snapshot.downloadURL;
					// push to db
					this.firebaseApp.database().ref('clips/' + this.firebaseUser.uid + '/' + this.timestamp).set({
						clips: { 'src': downloadURL },
						thumbs: { 'src': 'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/assets%2Fplaceholder.png?alt=media&token=07c50ad0-781b-4266-a0c7-8cfcbd421c91' },
						views: 0,
						cmntsCount: 0,
						timestamp: this.timestamp
					});

				});

		});

	}


	openUploadBox = function () {
		document.getElementById('files').click();
	}

	publishClip = function(){

		// push meta to DB
		firebase.database().ref('clips/' + this.firebaseUser.uid + '/' + this.timestamp).update({
			description: this.description ? this.description : '',
			plates: this.plates ? this.plates : '',
			location: ''// TODO: upload GPSX or pinpont in map
		});

		this.router.navigate(['/profile/' + this.firebaseUser.uid + '/' + this.timestamp], { relativeTo: this.route });

	}
	ngOnInit() {

		// Setup the dnd listeners.
		const dropZone = document.getElementById('drop_zone');
		dropZone.addEventListener('dragleave', e => {

			dropZone.classList.remove('hoveredFile');

		});

		dropZone.addEventListener('dragenter', e => {
			dropZone.classList.add('hoveredFile');
		});

		dropZone.addEventListener('dragover', e => {
			dropZone.classList.add('hoveredFile');
			e.stopPropagation();
			e.preventDefault();
		})

		dropZone.addEventListener('drop', e => {
			dropZone.classList.remove('hoveredFile');
			this.handleFileSelect(e);
		});

		document.getElementById('files').addEventListener('change', e => {
			dropZone.classList.remove('hoveredFile');
			console.log(e)
			this.handleFileSelect(e);
		}, false);




	}

}
