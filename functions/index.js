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
var viewCounter = require(__dirname + '/cloud/viewCount.js');
var getThumb = require(__dirname + '/cloud/getThumb.js');
var purchase = require(__dirname + '/purchase/purchase.js');

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
 * Add updated cmntsCount to threads & update the description for the thread with the latest post
 */
exports.cmntsCount = functions.database.ref('/conversations/{threadId}/{conversationId}').onWrite((change, context) => {
	return new Promise((resolve, reject) => {
		var promises = [];
		if (!context.params.threadId) {
			console.log('not enough data');
			return null;
		}
		// Only process data when it is first created.
		if (change.before.val()) {
			return;
		}
		return change.after.ref.root
			.child('threads')
			.child(context.params.threadId)
			.child('slug')
			.once('value')
			.then(function(slug) {
				var conv = change.after.val();
				change.after.ref.root
					.child('pushTokens')
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
								change.after.ref.root
									.child('conversations')
									.child(context.params.threadId)
									.once('value')
									.then(conversation => {
										//dispatch email
										mailer.sendToTopic(context.params.threadId, context.params.threadId, conv);
										var resObj = {
											cmntsCount: conversation.numChildren(),
											description: conv.body
										};
										//dispatch notifications
										//FCM.sendToTopic(slug.val(), pushToken.val());

										if (conversation.numChildren() > 1) {
											delete resObj['description'];
										}
										change.after.ref.root
											.child('threads')
											.child(context.params.threadId)
											.update(resObj)
											.then(res => resolve(res), err => reject(err));
									});
							},
							err => reject(err)
						);
					});
			});
	});
});
/*
 * Add updated cmntsCount to clips
 */
exports.cmntsCountVideo = functions.database
	.ref('/conversations_video/{uid}/{videId}/{conversationId}')
	.onWrite((change, context) => {
		if (!context.params.videId || !context.params.uid || !context.params.conversationId) {
			console.log('not enough data');
			return null;
		}
		change.after.ref.root
			.child('conversations_video/' + context.params.uid + '/' + context.params.videId)
			.once('value')
			.then(conversationVideo => {
				change.after.ref.root
					.child('clips/' + context.params.uid + '/' + context.params.videId + '/cmntsCount')
					.set(conversationVideo.numChildren());

				var r = {};
				r[context.params.conversationId] = change.after.val();
				change.after.ref.root.child('clips/' + context.params.uid + '/' + context.params.videId + '/comments').set(r);
			});

		return change.after.ref.root
			.child('clips')
			.child(context.params.uid)
			.child(context.params.videId)
			.child('lastUpdate')
			.set(new Date().getTime());
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

exports.notifyVideoUploaded = functions.database.ref('/clips/{uid}/{videoId}/processed').onWrite((change, context) => {
	return new Promise((resolve, reject) => {
		let promiseCollector = [];

		if (!context.params.uid || !context.params.videoId) {
			reject('{"err": "not enough data"}');
			return;
		}

		const uid = context.params.uid;
		const filename = context.params.videoId;
		cloud.isProcessed(uid, filename).then(
			isProcessed => {
				if (isProcessed != 'true' && isProcessed !== true) {
					resolve('{"err": "Already processed.."}');
					return;
				}

				//track event
				mixpanel.track('video_upoload', {
					distinct_id: uid,
					filename: filename
				});
				//notify user his video is live!
				admin
					.auth()
					.getUser(uid)
					.then(
						function(userRecord) {
							admin
								.database()
								.ref('clips')
								.child(uid)
								.child(filename.split('.')[0])
								.once(
									'value',
									function(snapshot) {
										const user = userRecord.toJSON();
										const clip = snapshot.val();
										//notify user his video is live!
										var template = fs.readFileSync('./mailer/templates/videoIsOn.mail', 'utf8');
										params = {
											FULL_NAME: user.displayName.split(' ')[0],
											VIDEO_POSTER:
												'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/thumbs%2F' +
												uid +
												'%2F' +
												filename.split('.')[0] +
												'.jpg?alt=media',
											VIDEO_LINK: 'https://dride.io/profile/' + uid + '/' + filename.split('.')[0],
											to: []
										};
										template = this.mailer.replaceParams(params, template);

										const sendObj = {
											to: user.email,
											from: 'hello@dride.io',
											subject: 'Your video is now on Dride Cloud',
											text: htmlToText.fromString(template),
											html: template,
											sendMultiple: true
										};

										promiseCollector.push(this.mailer.send(sendObj));

										sendObj.to = 'yossi@dride.io';
										promiseCollector.push(this.mailer.send(sendObj));

										sendObj.to = 'eitan@dride.io';
										promiseCollector.push(this.mailer.send(sendObj));

										Promise.all(promiseCollector).then(_ => {
											resolve('{"status": "completed"}');
											return;
										});
									},
									function(errorObject) {
										console.log('The read failed: ' + errorObject.code);
										reject('{"status": "' + errorObject.code + '"}');
										return;
									}
								);
						},
						function(errorObject) {
							console.log('Error fetching user data: ' + errorObject.code);
							reject('{"status": "' + errorObject.code + '"}');
							return;
						}
					);
			},
			err => {
				reject('{"status": "' + err + '"}');
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
	console.log('issuePurcahse');
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
		//send SSR content
		request('http://34.249.141.56:4000/' + req.originalUrl, function(error, response, body) {
			res.status(200).send(body);
		});
	} else {
		res.status(200).sendFile(path.resolve('dist/index.html'));
	}
});
