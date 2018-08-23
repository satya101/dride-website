var admin = require('firebase-admin');

var serviceAccount = require('./appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://dride-2384f.firebaseio.com'
});
// var tUser  = null;
// var r  = [];
// var res  = [];

var db = admin.database();
var fs = admin.firestore();

var ref = db.ref('clips');
ref.once(
	'value',
	function(snapshot) {
		res = [];
		clips = snapshot.val();
		console.log(clips);
		for (var key in clips) {
			for (var clip in clips[key]) {
				fs.collection('clips').add(
					Object.assign(clips[key][clip], {
						uid: key,
						id: clip
					})
				);
			}
		}

		console.log(res);
	},
	function(errorObject) {
		console.log('The read failed: ' + errorObject.code);
	}
);

// function listAllUsers(nextPageToken) {
// 	var fbPhoto = '';
// 	// List batch of users, 1000 at a time.
// 	admin.auth().listUsers(10, nextPageToken)
// 	  .then(function(listUsersResult) {
// 		listUsersResult.users.forEach(function(userRecord) {
// 		  tUser = userRecord.toJSON()
// 		  if (tUser.providerData[0].providerId == 'facebook.com'){
// 			  fbPhoto = 'https://graph.facebook.com/'+tUser.providerData[0].uid+'/picture?type=large&w‌​idth=400&height=400';
// 			  r[tUser.uid] = {'fid': tUser.providerData[0].uid, name: tUser.providerData[0].displayName, photoURL: fbPhoto, photoURL2: tUser.providerData[0].photoURL}
// 		  }else{
// 			  r[tUser.uid] = {name: tUser.displayName, photoURL: tUser.photoURL}
// 		  }
// 		});

// 		ref.set(r).then(_ => {
// 			console.log('updated')
// 		})
// 		if (listUsersResult.pageToken) {
// 		  // List next batch of users.
// 		  listAllUsers(listUsersResult.pageToken)
// 		}
// 	  })
// 	  .catch(function(error) {
// 		console.log("Error listing users:", error);
// 	  });
//   }
//   // Start listing users from the beginning, 1000 at a time.
//   listAllUsers();

// var token = {
// 	email: 'reed.mcfadden@gmail.com',
// 	card: {
// 		id: 'card_1CjGJtEuDB8ope0pd0nNcIkb',
// 		object: 'card',
// 		address_city: 'Provo',
// 		address_country: 'United States',
// 		address_line1: '1910 N 840 W',
// 		address_line1_check: 'pass',
// 		address_line2: null,
// 		address_state: 'UT',
// 		address_zip: '84604',
// 		address_zip_check: 'pass',
// 		brand: 'MasterCard',
// 		country: 'US',
// 		customer: 'cus_D9ZSmSKd9AhPty',
// 		cvc_check: 'pass',
// 		dynamic_last4: null,
// 		exp_month: 11,
// 		exp_year: 2023,
// 		fingerprint: 'zlrB52SIR2bSKOOo',
// 		funding: 'credit',
// 		last4: '9364',
// 		name: 'Reed McFadden'
// 	}
// };
// ref
// 	.add({
// 		uid: '13wWlEhD1FbA1D2J9XHrmo6Jk2Q2',
// 		sum: '3000',
// 		quantity: '1',
// 		productId: 'dride-hat',
// 		token: token
// 	})
// 	.then(() => console.log('ok'), error => console.log(error));

// var params = {
// 	uid: 'CRD4alk1oRPKZ0eaFM3swg4IbWJ3',
// 	sum: '14900',
// 	quantity: '1',
// 	productId: 'dride-kit',
// 	amount: '1',
// 	description: '(1) Dride Zero 3D printed prototype',
// 	token:
// 		'{"id":"tok_1CmzO3EuDB8ope0pSzk5sc5Y","object":"token","card":{"id":"card_1CmzO2EuDB8ope0p0syGbTK4","object":"card","address_city":"Vijayawada","address_country":"India","address_line1":"9-25-13","address_line1_check":"unavailable","address_line2":null,"address_state":"02","address_zip":"520001","address_zip_check":"unavailable","brand":"Visa","country":"IN","cvc_check":"pass","dynamic_last4":null,"exp_month":2,"exp_year":2022,"funding":"credit","last4":"7666","metadata":{},"name":"Rama Krishna","tokenization_method":null},"client_ip":"103.44.12.6","created":1531381131,"email":"rajeevkkrishna@gmail.com","livemode":true,"type":"card","used":false}'
// };

// var db = admin.firestore();
// var aTuringRef = db.collection('purchases');

// var setAlan = aTuringRef
// 	.add({
// 		uid: params.uid,
// 		sum: params.sum,
// 		quantity: params.quantity,
// 		productId: params.productId,
// 		token: JSON.parse(params.token)
// 	})
// 	.then(r => console.log('xxx', r), error => console.log('error', error));
