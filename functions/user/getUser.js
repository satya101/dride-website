var admin = require('firebase-admin');

getUser = {
	/*
     * get user details
     */
	getUserByUID: uid => {
		return new Promise((resolve, reject) => {
			admin
				.auth()
				.getUser(uid)
				.then(
					userRecord => {
						resolve(userRecord.toJSON());
					},
					error => {
						reject(error);
					}
				);
		});
	},
	/*
     * get user details by videoId
     */
	getUserByVideoId: videoId => {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			db.collection('clips')
				.doc(videoId)
				.get()
				.then(
					videoObject => {
						if (videoObject.exists) {
							resolve(videoObject.data().uid);
						} else {
							reject();
						}
					},
					e => reject(e)
				);
		});
	}
};

module.exports = getUser;
