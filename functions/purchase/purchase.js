var admin = require('firebase-admin');
var fs = require('fs');
var getUser = require('../user/getUser.js');

purchase = {
	issuePurcahse: params => {
		keys = JSON.parse(fs.readFileSync('./config/keys.json', 'utf8'));
		const keyPublishable = keys.PUBLISHABLE_KEY;
		const keySecret = keys.SECRET_KEY;

		const stripe = require('stripe')(keySecret);
		console.log(params);
		return new Promise((resolve, reject) => {
			let amount = parseInt(params.sum);
			let token = JSON.parse(params.token);

			getUser.getUserByUID(params.uid).then(
				user => {
					stripe.customers
						.create({
							email: token.email,
							source: token.id
						})
						.then(customer => {
							stripe.charges
								.create({
									amount,
									description: params.description,
									currency: 'usd',
									customer: customer.id,
									metadata: {
										uid: user.uid,
										email: user.email,
										quantity: params.quantity,
										productId: params.productId
									},
									receipt_email: token.email
								})
								.then(
									charge => {
										console.log('chrge', charge);
										var db = admin.firestore();
										var aTuringRef = db.collection('purchases');

										var setAlan = aTuringRef
											.add({
												uid: params.uid,
												sum: params.sum,
												quantity: params.quantity,
												productId: params.productId,
												token: JSON.parse(params.token),
												timestamp: new Date()
											})
											.then(() => resolve(), error => reject(error));
									},
									error => {
										console.error(error);
										reject(error);
									}
								);
						});
				},
				error => reject(error)
			);
		});
	}
};

module.exports = purchase;
