var admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
var env = require('../environments/environment.prod');

const sgClient = require('@sendgrid/client');
sgClient.setApiKey(env.environment.sendGrid);

var marked = require('marked');

subscriber = {
	/*
     * Subscribe user to a the mailing list
     */
	subscribeUser: function(email, user) {
		return new Promise((resolve, reject) => {
			if (!user.displayName) user.displayName = '';

			const request = {
				url: '/contactdb/recipients',
				method: 'POST',
				body: [
					{
						email: email,
						first_name: user.displayName.split(' ')[0],
						last_name: user.displayName.split(' ')[1]
					}
				],
				url: '/v3/contactdb/recipients'
			};
			sgClient
				.request(request)
				.then(([response, body]) => {
					//loop threw Id's and add them to the list
					const request = {
						method: 'POST',
						body: [
							{
								recipient_id: response.body.persisted_recipients[0]
							}
						],
						url: '/v3/contactdb/lists/2951914/recipients/' + response.body.persisted_recipients[0]
					};
					sgClient
						.request(request)
						.then(([response, body]) => {
							//loop threw Id's and add them to the list
							console.log('added subscribe');
							resolve();
						})
						.catch(err => {
							console.error('2', err);
							reject(err);
						});
				})
				.catch(err => {
					console.error('1', err);
					reject(err);
				});
		});
	}
};

module.exports = subscriber;
