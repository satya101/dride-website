var admin = require('firebase-admin');

var achievements = {
	FIRST_VIDEO: 'First Video Upload',
	FIFTH_VIDEO: 'Fifth Video Upload',
	FIRST_COMMENT: 'First Comment',
	TENS_COMMENT: 'Writer',
	LEAVE_REVIEW: 'Reviewer',
	BOUGHT_DRIDE_PRODUCT: 'Dride Owner',
	TEN_VIEWS_TOTAL: 'Junior Star',
	'100_VIEWS_TOTAL': 'Mega Star'
};
push = {
	/*
     * Send push to user
     */
	send: function(uid, title, body, data) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			db.collection('pushTokens')
				.doc(uid)
				.get()
				.then(
					snapshot => {
						var tokenObject = snapshot.data();
						if (tokenObject && tokenObject.token) {
							push
								.sendPushByToken(tokenObject.token, title, body.replace('%' + title + '%', achievements[title]), data)
								.then(res => resolve(res), err => reject(err));
						} else {
							console.warn('no token..Not sending push..');
							resolve();
						}
					},
					err => reject(err)
				);
		});
	},
	/**
	 * @description will send push by token
	 */
	sendPushByToken: function(token, title, body, data) {
		return new Promise((resolve, reject) => {
			// See documentation on defining a message payload.
			var message = {
				notification: {
					title: title,
					body: body
				},
				data: data,
				token: token
			};

			// Send a message to the device corresponding to the provided
			// registration token.
			admin
				.messaging()
				.send(message)
				.then(response => {
					resolve(response);
				})
				.catch(error => {
					reject(error);
				});
		});
	},
	getPushTokenByUid: function(uid) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			db.collection('pushTokens')
				.doc(uid)
				.get()
				.then(
					pushToken => {
						if (pushToken.exists && pushToken.data()) {
							resolve(pushToken.data().token);
						} else {
							resolve(null);
						}
					},
					err => reject(err)
				);
		});
	},
	sendPushByUid: function(uid, title, body, data) {
		return new Promise((resolve, reject) => {
			push.getPushTokenByUid(uid).then(
				token => {
					console.log('xxx', uid, token);
					push.sendPushByToken(token, title, body, data).then(() => resolve(), err => reject(err));
				},
				err => reject(err)
			);
		});
	}
};

module.exports = push;
