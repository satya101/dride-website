var admin = require('firebase-admin');

FCM = {
	/*
   * Subscribe user to a topic
   */
	subscribeUserToTopic: (registrationToken, topicId) => {
		console.log('subsribe to topic', registrationToken, topicId);
		return new Promise(resolve => {
			if (!registrationToken) {
				resolve();
				return;
			}

			// Subscribe the poster to the topic
			topicId = topicId.replace('a-zA-Z0-9-_.~%', '');
			admin
				.messaging()
				.subscribeToTopic(registrationToken, topicId)
				.then(
					() => resolve(),
					e => {
						console.error('subscribeUserToTopic', e);
						resolve();
					}
				);
		});
	},

	/*
   * send a post to a topic
   */
	sendToTopic: (initiatorToken, topicId, body) => {
		topicId = topicId.replace('a-zA-Z0-9-_.~%', '');

		var payload = {
			notification: {
				title: 'New response on Dride Forum 👩‍💻',
				body: body ? body : "Someone just posted a comment on a thread you've participating in.",
				click_action: 'https://dride.io/thread/' + topicId,
				icon: '/images/pwa/icon-144x144.png'
			},
			data: {
				threadId: topicId,
				deepLink: 'forum'
			}
		};

		//un-subscribe OP from topic
		if (!initiatorToken) initiatorToken = '-';

		admin
			.messaging()
			.unsubscribeFromTopic(initiatorToken, topicId)
			.then(function(response) {
				console.log('unsubscribed: ' + initiatorToken);
				console.log('topic: ' + topicId);
				admin
					.messaging()
					.sendToTopic(topicId, payload)
					.then(
						response => {
							// See the MessagingDevicesResponse reference documentation for
							// the contents of response.
							console.log('Successfully sent message:', response);
							//re-subscribe user to the topic
							FCM.subscribeUserToTopic(initiatorToken, topicId);
						},
						error => {
							console.log('Error sending message:', error);
						}
					);
			});
	}
};

module.exports = FCM;
