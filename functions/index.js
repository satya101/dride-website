var functions = require('firebase-functions');
var admin = require('firebase-admin');
var request = require('request');
var path = require('path');
var http = require('http');
var fs = require('fs');
var htmlToText = require('html-to-text');

var cors = require('cors')({
	origin: true
});
var mobile = require('is-mobile');

admin.initializeApp();
// grab the Mixpanel factory
var Mixpanel = require('mixpanel');
// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('eae916fa09f65059630c5ae451682939');
var FCM = require(__dirname + '/FCM/subscribe.js');
var mailer = require(__dirname + '/mailer/send.js');
var subscriber = require(__dirname + '/mailer/subscribe.js');
var anonymizer = require(__dirname + '/user/anonymizer.js');
var cloud = require(__dirname + '/cloud/cloud.js');
var meta = require(__dirname + '/meta/meta.js');
var viewCounter = require(__dirname + '/cloud/viewCount.js');
//var getThumb = require(__dirname + '/cloud/getThumb.js');
var purchase = require(__dirname + '/purchase/purchase.js');

var algoliasearch = require('algoliasearch');

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

/*
 *	HTTP endpoint to subscribe a user to mailing list
 */
exports.subscriber = functions.https.onRequest(function(req, res) {
	var r = req.query.email
		? {
				status: subscriber.subscribeUser(req.query.email, {})
		  }
		: {
				status: -1
		  };
	cors(req, res, function() {
		res.status(200).send(r);
	});
});
/*
 *	HTTP endpoint to increase views counter
 */
exports.viewCounter = functions.https.onRequest((req, res) => {
	viewCounter.addView(req.query).then(
		() => {
			cors(req, res, () => {
				res.status(200).send({
					status: 1
				});
			});
		},
		err => {
			cors(req, res, () => {
				res.status(200).send({
					status: -1
				});
			});
		}
	);
});
/*
 *	HTTP endpoint to increase views counter
 */
exports.viewCounterFS = functions.https.onRequest((req, res) => {
	viewCounter.addViewFS(req.query).then(
		() => {
			cors(req, res, () => {
				res.status(200).send({
					status: 1
				});
			});
		},
		err => {
			cors(req, res, () => {
				res.status(200).send({
					status: -1
				});
			});
		}
	);
});
/*
 * Add updated cmntsCount to threads & update the description for the thread with the latest post
 */
exports.cmntsCount = functions.firestore
	.document('forum/{threadId}/conversations/{conversationId}')
	.onWrite((change, context) => {
		return new Promise((resolve, reject) => {
			var promises = [];
			if (!context.params.threadId) {
				console.log('not enough data');
				reject();
				return null;
			}
			// Only process data when it is first created.
			if (change.before.data()) {
				reject();
				return;
			}
			var db = admin.firestore();
			var rtdb = admin.database();

			var conv = change.after.data();

			rtdb
				.ref('pushTokens')
				.child(conv.autherId)
				.child('value')
				.once('value')
				.then(pushToken => {
					// try {
					// 	promises.push(FCM.subscribeUserToTopic(pushToken.val(), slug.val()));
					// } catch (e) {
					// 	console.error('fcm', e);
					// }
					try {
						promises.push(mailer.subscribeUserToTopic(conv.autherId, context.params.threadId));
					} catch (e) {
						console.error('mailer', e);
					}

					Promise.all(promises).then(
						res => {
							console.log('subsribed all');
							db.collection('forum')
								.doc(context.params.threadId)
								.collection('conversations')
								.get()
								.then(conversation => {
									//dispatch email
									mailer.sendToTopic(context.params.threadId, context.params.threadId, conv);
									var resObj = {
										cmntsCount: conversation.size,
										description: conv.body
									};
									//dispatch notifications
									//FCM.sendToTopic(slug.val(), pushToken.val());

									if (conversation.size > 1) {
										delete resObj['description'];
									}
									console.log('update forum', resObj);
									db.collection('forum')
										.doc(context.params.threadId)
										.update(resObj)
										.then(res => resolve(res), err => reject(err));
								});
						},
						err => reject(err)
					);
				});
		});
	});

// Update the search index every time a blog post is written.
exports.onForumUpdate = functions.firestore
	.document('forum/{threadId}/conversations/{conversationId}')
	.onCreate((snap, context) => {
		// Get the post document
		const data = snap.data();
		const post = {
			body: data.body,
			auther: data.auther,
			timestamp: data.timestamp,
			threadId: context.params.threadId,
			objectID: context.params.conversationId
		};

		// Write to the algolia index
		const index = client.initIndex('forum');
		return index.saveObject(post);
	});

/**
 * @description update comments counter for clips comments
 */
exports.cmntsCountVideo = functions.firestore.document('clipsComments/{conversationId}').onCreate((snap, context) => {
	return new Promise((resolve, reject) => {
		var comment = snap.data();
		var db = admin.firestore();
		db.settings({ timestampsInSnapshots: true });

		db.collection('clipsComments')
			.where('videoId', '==', comment.videoId)
			.get()
			.then(
				conversation => {
					db.collection('clips')
						.doc(comment.videoId)
						.update({ cmntsCount: conversation.size })
						.then(() => resolve(), err => reject(err));
				},
				err => reject(err)
			);
	});
});

/*
 *   Save users data upon register
 */
exports.saveNewUserData = functions.auth.user().onCreate((user, context) => {
	return new Promise((resolve, reject) => {
		var usersRef = admin
			.database()
			.ref('userData')
			.child(user.uid);

		var resObj = {
			name: user.displayName, //anonymizer.getRandomName()
			photoURL: user.photoURL
		};
		resObj = JSON.parse(JSON.stringify(resObj));

		if (user.providerData && user.providerData[0] && user.providerData[0].providerId == 'facebook.com') {
			resObj['fid'] = user.providerData[0].uid;
			resObj['photoURL_orig'] = resObj['photoURL'];
			resObj['photoURL'] = 'https://graph.facebook.com/' + resObj['fid'] + '/picture?type=large&w‌​';
		}

		var flName = user.displayName ? user.displayName.split(' ') : '';
		resObj = JSON.parse(JSON.stringify(resObj));
		usersRef.update(resObj).then(function() {
			// create a user in Mixpanel Engage
			mixpanel.people.set(user.displayName, {
				$first_name: flName.length ? flName[0] : '',
				$last_name: flName.length > 0 ? flName[1] : '',
				$created: new Date().toISOString(),
				email: user.email,
				distinct_id: user.uid
			});
		});

		//subscribe to list
		subscriber.subscribeUser(user.email, user);

		resolve();
	});
});
/*
 * Anonymise a user upon request
 */
exports.anonymizer = functions.database.ref('/userData/{uid}/anonymous').onWrite((change, context) => {
	if (!context.params.uid) {
		console.log('not enough data');
		return null;
	}
	var anonymStatus = change.after.val();
	return anonymizer.start(anonymStatus, context.params.uid);
});
/*
 * remove clips on event
 */
exports.deleteVideo = functions.database.ref('/clips/{uid}/{videoId}/deleted').onWrite((change, context) => {
	if (!context.params.uid || !context.params.videoId) {
		console.log('not enough data');
		return null;
	}
	//REMOVE SOON: update RTDB with status
	admin
		.firestore()
		.collection('clips')
		.where('uid', '==', context.params.uid)
		.where('id', '==', context.params.videoId)
		.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				admin
					.firestore()
					.collection('clips')
					.doc(doc.id)
					.delete();
			});
		});

	var clipDeleteStatus = change.after.val();
	if (clipDeleteStatus) return cloud.remvoeClip(context.params.videoId, context.params.uid);
});
/*
 * move clip to the homePage
 */
exports.copyToHP = functions.database.ref('/clips/{uid}/{videoId}').onWrite((change, context) => {
	// Exit when the data is deleted.
	if (!change.before.val()) {
		return;
	}

	if (!context.params.uid || !context.params.videoId) {
		console.log('not enough data');
		return;
	}
	console.log('copy ' + context.params.videoId);
	var clip = change.after.val();
	if (clip && clip.homepage) {
		return cloud.copyToHP(context.params.videoId, context.params.uid, clip, clip.hpRef);
	} else {
		return;
	}
});

exports.processVideo = functions.database.ref('/clips/{uid}/{videoId}/clips').onCreate((snap, context) => {
	let promiseCollector = [];
	return new Promise((resolve, reject) => {
		if (!context.params.uid || !context.params.videoId) {
			console.error('not enough data');
			resolve();
			return;
		}

		uid = context.params.uid;
		filename = context.params.videoId;

		request('http://34.249.141.56:8080/processVideo/' + uid + '/' + filename, function(error, response, body) {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
			resolve();
		});

		setTimeout(() => {
			resolve();
		}, 2000);
	});
});

/**
 * @deprecated RTDB is no longer actively maintained!
 */
exports.notifyVideoUploaded = functions.database.ref('/clips/{uid}/{videoId}/processed').onWrite((change, context) => {
	return new Promise((resolve, reject) => {
		resolve();
		// let promiseCollector = [];

		// if (!context.params.uid || !context.params.videoId) {
		// 	reject('{"err": "not enough data"}');
		// 	return;
		// }

		// const uid = context.params.uid;
		// const filename = context.params.videoId;
		// console.log(change.after.val());
		// if (change.after.val() != 'true' && change.after.val() !== true) {
		// 	console.log('{"err": "Already processed.."}');
		// 	resolve('{"err": "Already processed.."}');
		// 	return;
		// }

		// //track event
		// mixpanel.track('video_upoload', {
		// 	distinct_id: uid,
		// 	filename: filename
		// });
		// //notify user his video is live!
		// admin
		// 	.auth()
		// 	.getUser(uid)
		// 	.then(
		// 		userRecord => {
		// 			console.log(uid);
		// 			console.log(filename.split('.')[0]);
		// 			admin
		// 				.database()
		// 				.ref('clips')
		// 				.child(uid)
		// 				.child(filename.split('.')[0])
		// 				.once(
		// 					'value',
		// 					snapshot => {
		// 						const user = userRecord.toJSON();
		// 						const clip = snapshot.val();
		// 						console.log(clip);
		// 						//notify user his video is live!
		// 						var template = fs.readFileSync('./mailer/templates/videoIsOn.mail', 'utf8');
		// 						params = {
		// 							FULL_NAME: user.displayName.split(' ')[0],
		// 							VIDEO_POSTER:
		// 								'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/thumbs%2F' +
		// 								uid +
		// 								'%2F' +
		// 								filename.split('.')[0] +
		// 								'.jpg?alt=media',
		// 							VIDEO_LINK: 'https://dride.io/profile/' + uid + '/' + filename.split('.')[0],
		// 							to: []
		// 						};
		// 						template = mailer.replaceParams(params, template);

		// 						const sendObj = {
		// 							to: user.email,
		// 							from: 'hello@dride.io',
		// 							subject: 'Your video is now on Dride Cloud',
		// 							text: htmlToText.fromString(template),
		// 							html: template,
		// 							sendMultiple: true
		// 						};

		// 						promiseCollector.push(mailer.send(sendObj));

		// 						sendObj.to = 'yossi@dride.io';
		// 						promiseCollector.push(mailer.send(sendObj));

		// 						sendObj.to = 'eitan@dride.io';
		// 						promiseCollector.push(mailer.send(sendObj));

		// 						Promise.all(promiseCollector).then(_ => {
		// 							console.log('done!@!@!@!@!');
		// 							resolve('{"status": "completed"}');
		// 							return;
		// 						});
		// 					},
		// 					errorObject => {
		// 						console.log('The read failed: ' + errorObject.code);
		// 						reject('{"status": "' + errorObject.code + '"}');
		// 						return;
		// 					}
		// 				);
		// 		},
		// 		errorObject => {
		// 			console.log('Error fetching user data: ' + errorObject.code);
		// 			reject('{"status": "' + errorObject.code + '"}');
		// 			return;
		// 		}
		// 	);
	});
});

exports.notifyVideoUploadedFS = functions.firestore.document('clips/{videoId}').onCreate((snap, context) => {
	return new Promise((resolve, reject) => {
		let promiseCollector = [];
		const clipObject = snap.data();
		if (!context.params.videoId) {
			reject('{"err": "not enough data"}');
			return;
		}

		// if (typeof clipObject.processed == 'undefined' && clipObject.processed != 'true' && clipObject.processed !== true) {
		// 	console.log(clipObject.processed);
		// 	console.log('{"err": "Already processed.."}');
		// 	resolve('{"err": "Already processed.."}');
		// 	return;
		// }

		const uid = clipObject.uid;
		const filename = clipObject.id;

		//track event
		mixpanel.track('video_upoload', {
			distinct_id: uid,
			filename: filename
		});
		//notify user his video is live!
		console.log('uid', uid);
		admin
			.auth()
			.getUser(uid)
			.then(
				userRecord => {
					const user = userRecord.toJSON();
					//notify user his video is live!
					var template = fs.readFileSync('./mailer/templates/videoIsOn.mail', 'utf8');
					params = {
						FULL_NAME: user.displayName.split(' ')[0],
						VIDEO_POSTER:
							'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/thumbs%2F' +
							uid +
							'%2F' +
							filename +
							'.jpg?alt=media',
						VIDEO_LINK: 'https://dride.io/clip/' + context.params.videoId,
						to: []
					};
					template = mailer.replaceParams(params, template);

					const sendObj = {
						to: user.email,
						from: 'hello@dride.io',
						subject: 'Your video is now on Dride Cloud',
						text: htmlToText.fromString(template),
						html: template,
						sendMultiple: true
					};

					promiseCollector.push(mailer.send(sendObj));

					sendObj.to = 'yossi@dride.io';
					promiseCollector.push(mailer.send(sendObj));

					sendObj.to = 'eitan@dride.io';
					promiseCollector.push(mailer.send(sendObj));

					Promise.all(promiseCollector).then(_ => {
						cloud
							.processVideoFS(context.params.videoId, clipObject)
							.then(() => resolve('{"status": "completed"}'), err => reject('{"status": "' + err + '"}'));
						return;
					});
				},
				errorObject => {
					console.log('The read failed: ' + errorObject.code);
					reject('{"status": "' + errorObject.code + '"}');
					return;
				}
			);
	});
});

exports.logGPS = functions.https.onRequest((req, res) => {
	console.log('Headers:\n', req.headers);
	console.log('Body:\n', req.body);
	console.log('------------------------------');
	const sendObj = {
		template_name: 'video-is-on',
		subject: JSON.stringify(req.body),
		to: [
			{
				email: 'yossi@dride.io'
			}
		],
		tags: ['video uploaded!'],
		global_merge_vars: [
			{
				name: 'FULL_NAME',
				content: ''
			},
			{
				name: 'VIDEO_POSTER',
				content: ''
			},
			{
				name: 'VIDEO_LINK',
				content: 'https://dride.io/profile/'
			}
		]
	};

	// mailer.send(sendObj)

	res.sendStatus(200);
});

exports.issuePurcahse = functions.https.onRequest((req, res) => {
	purchase.issuePurcahse(req.query).then(
		() => {
			cors(req, res, () => {
				res.status(200).send({
					status: 1
				});
			});
		},
		err => {
			cors(req, res, () => {
				res.status(200).send({
					status: -1,
					error: err
				});
			});
		}
	);
});

exports.metaService = functions.https.onRequest((req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
	var userAgent = req.headers['user-agent'];
	const botList = 'baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|slackbot|facebot|developers.google.com/+/web/snippet/'.toLowerCase();
	if (
		userAgent.toLowerCase().search(botList) != -1 ||
		userAgent.indexOf('facebookexternalhit') !== -1 ||
		userAgent.indexOf('WhatsApp') !== -1 ||
		userAgent.indexOf('Facebot') !== -1 ||
		userAgent.indexOf('Twitterbot') !== -1 ||
		userAgent.indexOf('bingbot') !== -1 ||
		userAgent.indexOf('msnbot') !== -1 ||
		userAgent.indexOf('YandexBot') !== -1 ||
		userAgent.indexOf('vkShare') !== -1 ||
		userAgent.indexOf('XML Sitemaps Generator') !== -1 ||
		userAgent.indexOf('DuckDuckBot') !== -1
	) {
		const route = req.params[0].split('/');
		if (route[1] == 'clip') {
			meta.setMeta(fs.readFileSync('dist/index.html'), route[2]).then(
				body => {
					res.status(200).send(body);
				},
				e => res.status(500)
			);
		} else {
			//send SSR content
			request('http://34.249.141.56:4000/' + req.originalUrl, function(error, response, body) {
				res.status(200).send(body);
			});
		}
	} else {
		res.status(200).sendFile(path.resolve('dist/index.html'));
	}
});

// Update the search index every time a blog post is written.
exports.onClipUpload = functions.database.ref('/clips/{uid}/{clipId}').onCreate((snap, context) => {
	// Get the post document
	const clip = snap.val();
	console.log(clip);
	// push to firestore
	var db = admin.firestore();
	return db.collection('clips').add(
		Object.assign(clip, {
			uid: context.params.uid,
			id: context.params.clipId,
			isRTDB: true
		})
	);
});
// Update the search index every time a blog post is written.
exports.cloneAllToFireStore = functions.database.ref('/clips/{uid}/{videoId}').onWrite((snap, context) => {
	return new Promise((resolve, reject) => {
		//REMOVE SOON: update RTDB with status
		admin
			.firestore()
			.collection('clips')
			.where('uid', '==', context.params.uid)
			.where('id', '==', context.params.videoId)
			.limit(1)
			.get()
			.then(
				snapshot => {
					snapshot.forEach(doc => {
						admin
							.firestore()
							.collection('clips')
							.doc(doc.id)
							.update(snap.after.val())
							.then(() => resolve(), err => reject(err));
					});
				},
				e => reject(e)
			);
	});
});

/*
 * remove clips on event
 */
exports.deleteVideoFS = functions.firestore.document('clips/{videoKey}').onUpdate((change, context) => {
	const deletedValue = change.after.data();
	if (!deletedValue.deleted) {
		console.log('not delete');
		return null;
	}
	if (!context.params.videoKey) {
		console.log('not enough data');
		return null;
	}
	console.warn('remove:', deletedValue.id, deletedValue.uid, context.params.videoKey);
	return cloud.remvoeClipFS(deletedValue.id, deletedValue.uid, context.params.videoKey);
});
