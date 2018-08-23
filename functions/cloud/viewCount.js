var admin = require('firebase-admin');
const cors = require('cors')({
	origin: true
});

viewCounter = {
	/*
   * delete the video from a user profile, all it's comments and remove from HP.
   */
	addView: function(data) {
		return new Promise((resolve, reject) => {
			videoId = data.videoId;
			uid = data.op;

			var db = admin.database();
			var refClip = db
				.ref('clips')
				.child(uid)
				.child(videoId);
			refClip.once(
				'value',
				function(snapshot) {
					if (!snapshot.val()) return;

					var clipViews = snapshot.val().views;
					//increase counter

					db.ref('clips')
						.child(uid)
						.child(videoId)
						.update({
							views: (clipViews ? clipViews : 0) + 1
						})
						.then(
							() => {
								resolve();
							},
							err => reject(err)
						);
				},
				function(errorObject) {
					console.log('The read failed: ' + errorObject.code);
				}
			);
		});
	},
	/*
   * FIRESTORE delete the video from a user profile, all it's comments and remove from HP.
   */
	addViewFS: function(data) {
		return new Promise((resolve, reject) => {
			videoId = data.videoId;

			var db = admin.firestore();
			db.collection('clips')
				.doc(videoId)
				.get()
				.then(
					snapshot => {
						if (!snapshot.data()) return;

						var clipViews = snapshot.data().views;
						//increase counter

						db.collection('clips')
							.doc(videoId)
							.update({
								views: (clipViews ? clipViews : 0) + 1
							})
							.then(
								() => {
									resolve();
								},
								err => reject(err)
							);
					},
					errorObject => {
						reject(errorObject);
					}
				);
		});
	}
};

module.exports = viewCounter;
