var admin = require('firebase-admin');
var env = require('../environments/environment.prod');
var htmlToText = require('html-to-text');
var fs = require('fs');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(env.environment.sendGrid);
var marked = require('marked');

mailer = {
	/*
   * Subscribe user to a topic
   */
	subscribeUserToTopic: function(autherId, topicId) {
		return new Promise((resolve, reject) => {
			admin
				.auth()
				.getUser(autherId)
				.then(userRecord => {
					var db = admin.firestore();

					db.collection('topics')
						.where('topicId', '==', topicId)
						.where('uid', '==', autherId)
						.get()
						.then(
							topic => {
								//if user does not exists add him to the queue
								if (!topic.size) {
									db.collection('topics')
										.add({
											email: userRecord.email,
											uid: autherId,
											topicId: topicId
										})
										.then(res => resolve(res), err => reject(err));
								} else {
									resolve();
								}
							},
							err => reject(err)
						);
				});
		});
	},
	/*
   * Send mails to all subscribers
   */
	sendToTopic: function(topicId, conv) {
		return new Promise((resolve, reject) => {
			var db = admin.firestore();

			db.collection('forum')
				.doc(topicId)
				.get()
				.then(
					threadSnap => {
						var thread = threadSnap.data();
						var template = fs.readFileSync('./mailer/templates/updateUser.mail', 'utf8');
						params = {
							TOPIC_URL: 'https://dride.io/thread/' + topicId,
							FULL_NAME: conv.auther,
							TITLE: thread.title,
							PROFILE_PIC: conv.pic,
							BODY: marked(conv.body),
							TYPE: 'forum',
							template_name: 'update-user',
							SUBJECT: thread.title,
							cmntCount: thread.cmntCount,
							timestamp: conv.timestamp,
							to: []
						};
						template = mailer.replaceParams(params, template);

						const sendObj = {
							to: [],
							from: 'hello@dride.io',
							subject: thread.title,
							text: htmlToText.fromString(template),
							html: template,
							sendMultiple: true
							//sendAt: 1500077141,
						};

						//update subscribers on a new post

						//get subscribers email's
						db.collection('topics')
							.where('topicId', '==', topicId)
							.get()
							.then(
								topicSubscribersSnap => {
									topicSubscribersSnap.forEach(snap => {
										var userObject = snap.data();
										//exclude self
										if (userObject.uid != conv.autherId && !userObject.unsubscribe) {
											if (sendObj.subject) {
												sendObj.to = userObject.email;
												mailer.send(sendObj).then(res => resolve(res), err => reject(err));
											}
										}
									});
								},
								errorObject => {
									console.log('The read failed: ' + errorObject.code);
									reject(errorObject);
								}
							);
					},
					errorObject => {
						console.log('The read failed: ' + errorObject.code);
						reject(errorObject);
					}
				);
		});
	},
	send: function(sendObj) {
		return sgMail.send(sendObj).then(done => console.log('done'), err => console.log('err', err));
	},
	replaceParams: function(params, template) {
		Object.keys(params).forEach(function(key) {
			template = template.replace(new RegExp('\\*\\|' + key + '\\|\\*', 'g'), params[key]);
		});

		return template;
	}
};

module.exports = mailer;
