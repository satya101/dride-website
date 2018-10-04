var admin = require('firebase-admin');
var gcs = require('@google-cloud/storage')();
var request = require('request');

// var serviceAccount = require("../appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json");
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: "https://dride-2384f.firebaseio.com",
// 	storageBucket: "dride-2384f.appspot.com"
//   });

cloud = {
	/*
	 * DEPRACTED
     * delete the video from a user profile, all it's comments and remove from HP.
     */
	remvoeClip: function(videoId, uid) {
		var rtdb = admin.database();
		var refClip = rtdb
			.ref('clips')
			.child(uid)
			.child(videoId);

		return refClip.once(
			'value',
			function(snapshot) {
				var clipObj = snapshot.val();

				//remove from HP if needed
				if (clipObj && clipObj.hpRef) {
					var ref = rtdb.ref('clips_homepage').child(clipObj.hpRef);
					ref.remove();
				}

				//remove the clip
				var ref = rtdb
					.ref('clips')
					.child(uid)
					.child(videoId);
				ref.remove();

				//remove video comments
				var ref = rtdb
					.ref('conversations_video')
					.child(uid)
					.child(videoId);
				ref.remove();

				//remove clips from hosting
				var bucket = admin.storage().bucket();
				bucket.deleteFiles({ prefix: 'clips/' + uid + '/' + videoId + '.mp4' }, function(err) {
					console.log(err);
				});
				bucket.deleteFiles({ prefix: 'thumbs/' + uid + '/' + videoId + '.jpg' }, function(err) {
					console.log(err);
				});
				bucket.deleteFiles({ prefix: 'gps/' + uid + '/' + videoId + '.json' }, function(err) {
					console.log(err);
				});
			},
			function(errorObject) {
				console.log('The read failed: ' + errorObject.code);
			}
		);
	},

	remvoeClipFS: function(videoId, uid, key) {
		var prom = [];
		var db = admin.firestore();

		//remove from firestore
		try {
			db.collection('clips')
				.doc(key)
				.delete();
		} catch (e) {
			console.warn('no clip..');
		}
		//remove video comments
		try {
			db.collection('conversations_video')
				.doc(key)
				.delete();
		} catch (e) {
			console.warn('no conversation..');
		}

		//remove clips from hosting
		var bucket = admin.storage().bucket();
		prom.push(
			bucket
				.file('clips/' + uid + '/' + videoId + '.mp4')
				.delete()
				.then(
					res => {
						console.log(res);
					},
					e => console.error(e)
				)
		);
		prom.push(
			bucket
				.file('thumbs/' + uid + '/' + videoId + '.jpg')
				.delete()
				.then(
					res => {
						console.log(res);
					},
					e => console.error(e)
				)
		);
		prom.push(
			bucket
				.file('gps/' + uid + '/' + videoId + '.json')
				.delete()
				.then(
					res => {
						console.log(res);
					},
					e => console.error(e)
				)
		);

		return Promise.all(prom);
	},
	/*
     * copy the video to HP
     */
	copyToHP: function(videoId, uid, clip, hpRef) {
		var db = admin.database();
		var ref = db.ref('clips_homepage');
		clip.op = uid;
		clip.videoId = videoId;
		clip.hpInsertTime = new Date().getTime() + '';

		if (typeof hpRef === 'undefined') {
			console.log('add hp ref');
			var HpInsertedId = ref.push(clip).key;

			//add ref to clips/{uid}/{videoId}
			var clipRef = db
				.ref('clips')
				.child(uid)
				.child(videoId);
			//add op to the object
			return clipRef.update({ hpRef: HpInsertedId });
		} else {
			console.log('update views or whatever');
			var clipRef = db.ref('clips_homepage').child(hpRef);
			return clipRef.update(clip);
		}
	},

	processVideoFS(videoRef, clip) {
		return new Promise((resolve, reject) => {
			if (!videoRef) {
				console.error('not enough data');
				resolve();
				return;
			}
			if (clip && clip.isRTDB) {
				console.error('from RTDB skip processing');
				resolve();
				return;
			}

			request('http://34.249.141.56:8080/processVideoFS/' + videoRef, function(error, response, body) {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				console.log('body:', body); // Print the HTML for the Google homepage.
				resolve();
			});

			setTimeout(() => {
				resolve();
			}, 2000);
		});
	}
};

module.exports = cloud;
