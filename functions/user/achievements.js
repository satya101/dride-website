var admin = require('firebase-admin');
var push = require('../push/push');

achievements = {
	/*
     * increase number of videos counter
     */
	increaseVideoCounter: function(uid) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			db.collection('clips')
				.where('uid', '==', uid)
				.get()
				.then(
					snapshot => {
						db.collection('users')
							.doc(uid)
							.update({ videosUploaded: snapshot.size ? snapshot.size : 1 })
							.then(
								res => {
									//give gallon every 5 videos
									if (snapshot.size == 1 || snapshot.size == 5) {
										var achievementCode = snapshot.size == 1 ? 'FIRST_VIDEO' : 'FIFTH_VIDEO';
										achievements.addTrophy(uid, achievementCode).then(
											res => {
												resolve(res);
											},
											e => {
												resolve(e);
											}
										);
										return;
									}
									//give gallon every 5 videos
									else if (snapshot.size % 5 == 0) {
										achievements.addGallon(uid).then(
											res => {
												push
													.send(
														uid,
														"You've got a new Gallon! ⛽",
														'Keep uploading videos to the Dride Cloud to earn more Gallons',
														{
															achievement: 'GALLON',
															deepLink: 'achievement'
														}
													)
													.then(res => resolve(res), e => reject(e));
											},
											e => reject(e)
										);
										return;
									} else {
										resolve(res);
										return;
									}
								},
								err => reject(err)
							);
					},
					err => reject(err)
				);
		});
	},
	/*
     * increase number of gallons
     */
	addGallon: function(uid) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			let userRef = db.collection('users').doc(uid);
			userRef.get().then(
				snapshot => {
					userRef.update({ pts: snapshot.data().pts + 1 }).then(res => resolve(res), err => reject(err));
				},
				err => reject(err)
			);
		});
	},
	/*
     * add a trophy!!
     */
	addTrophy: function(uid, trophyCode) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();
			let userRef = db.collection('users').doc(uid);
			userRef.get().then(
				snapshot => {
					var trophies = [];
					if (snapshot.data() && snapshot.data().trophies) {
						trophies = snapshot.data().trophies;
					}
					if (trophies.indexOf(trophyCode) === -1) {
						trophies.push(trophyCode);
						userRef.update({ trophies: trophies }).then(
							res => {
								push
									.send(
										uid,
										'New achievement unlocked 🔥',
										'You are now the owner of a shiny new trophy: "%' + trophyCode + '%" 🏆',
										{
											achievement: trophyCode,
											deepLink: 'achievement'
										}
									)
									.then(res => resolve(res), e => reject(e));
							},
							err => reject(err)
						);
					} else {
						reject();
					}
				},
				err => reject(err)
			);
		});
	}
};

module.exports = achievements;
