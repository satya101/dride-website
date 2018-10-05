// var admin = require('firebase-admin');

// var serviceAccount = require('./appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json');

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: 'https://dride-2384f.firebaseio.com'
// });

// var registrationToken =
// 	'd_oYcKEldy4:APA91bHPvmjPoCqkltvYrjOrm5F9-yJBGpyjoBg11U_86MgeQvWOGyOs0dmjFdMCwwyWmmMs2d-bIzE1vpgRYw1mjfG8aHR3qLL6M25PR4T2io22Dhu0sMffj9nnaqNZGMAv_3Nd3SKk';

// // See documentation on defining a message payload.
// var message = {
// 	notification: {
// 		title: 'New achievement unlocked 🔥',
// 		body: 'You are now the owner of a shiny new trophy: "First Video Upload" 🏆'
// 	},
// 	data: {
// 		'image-url':
// 			'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/thumbs%2FtXuqLeiUr3blJK7JPG50UkeTzu92%2F1532698837000.jpg?alt=media',
// 		media_type: 'image',
// 		achievement: 'FIRST_VIDEO',
// 		deepLink: 'achievement'
// 	},

// 	token: registrationToken
// };

// // Send a message to the device corresponding to the provided
// // registration token.
// admin
// 	.messaging()
// 	.send(message)
// 	.then(response => {
// 		// Response is a message ID string.
// 		console.log('Successfully sent message:', response);
// 	})
// 	.catch(error => {
// 		console.log('Error sending message:', error);
// 	});

// // var tUser  = null;
// // var r  = [];
// // var res  = [];

// var db = admin.database();
// var fs = admin.firestore();

// var ref = db.ref('userData');
// ref.once(
// 	'value',
// 	async function(snapshot) {
// 		res = [];
// 		users = snapshot.val();

// 		for (var key in users) {
// 			if (!users[key].photoURL) {
// 				var randN = getRandomArbitrary(1, 5);
// 				users[key].photoURL =
// 					'https://storage.googleapis.com/dride-2384f.appspot.com/assets/profilePic/pic' + randN + '.png';
// 			}
// 			if (!users[key].name) {
// 				console.log(key, JSON.stringify(users[key]));

// 				// await admin
// 				// 	.auth()
// 				// 	.getUser(key)
// 				// 	.then(userRecord => {
// 				// 		var user = userRecord.toJSON();
// 				// 		users[key].name = user.displayName;
// 				// 		fs.collection('users')
// 				// 			.doc(key)
// 				// 			.set(
// 				// 				Object.assign(users[key], {
// 				// 					uid: key,
// 				// 					pts: 0,
// 				// 					videosUploaded: 0,
// 				// 					followers: 0
// 				// 				})
// 				// 			);
// 				// 	})
// 				// 	.catch(function(error) {
// 				// 		console.log('Error fetching user data:', error);
// 				// 	});
// 			} else {
// 				fs.collection('users')
// 					.doc(key)
// 					.set(
// 						Object.assign(users[key], {
// 							uid: key,
// 							pts: 0,
// 							videosUploaded: 0,
// 							followers: 0
// 						})
// 					);
// 			}
// 		}

// 		console.log(res);
// 	},
// 	function(errorObject) {
// 		console.log('The read failed: ' + errorObject.code);
// 	}
// );

// function updateUserName(uid, name) {}
// function getRandomArbitrary(min, max) {
// 	return parseInt(Math.random() * (max - min) + min);
// }

// // function listAllUsers(nextPageToken) {
// // 	var fbPhoto = '';
// // 	// List batch of users, 1000 at a time.
// // 	admin.auth().listUsers(10, nextPageToken)
// // 	  .then(function(listUsersResult) {
// // 		listUsersResult.users.forEach(function(userRecord) {
// // 		  tUser = userRecord.toJSON()
// // 		  if (tUser.providerData[0].providerId == 'facebook.com'){
// // 			  fbPhoto = 'https://graph.facebook.com/'+tUser.providerData[0].uid+'/picture?type=large&w‌​idth=400&height=400';
// // 			  r[tUser.uid] = {'fid': tUser.providerData[0].uid, name: tUser.providerData[0].displayName, photoURL: fbPhoto, photoURL2: tUser.providerData[0].photoURL}
// // 		  }else{
// // 			  r[tUser.uid] = {name: tUser.displayName, photoURL: tUser.photoURL}
// // 		  }
// // 		});

// // 		ref.set(r).then(_ => {
// // 			console.log('updated')
// // 		})
// // 		if (listUsersResult.pageToken) {
// // 		  // List next batch of users.
// // 		  listAllUsers(listUsersResult.pageToken)
// // 		}
// // 	  })
// // 	  .catch(function(error) {
// // 		console.log("Error listing users:", error);
// // 	  });
// //   }
// //   // Start listing users from the beginning, 1000 at a time.
// //   listAllUsers();

// // var token = {
// // 	email: 'reed.mcfadden@gmail.com',
// // 	card: {
// // 		id: 'card_1CjGJtEuDB8ope0pd0nNcIkb',
// // 		object: 'card',
// // 		address_city: 'Provo',
// // 		address_country: 'United States',
// // 		address_line1: '1910 N 840 W',
// // 		address_line1_check: 'pass',
// // 		address_line2: null,
// // 		address_state: 'UT',
// // 		address_zip: '84604',
// // 		address_zip_check: 'pass',
// // 		brand: 'MasterCard',
// // 		country: 'US',
// // 		customer: 'cus_D9ZSmSKd9AhPty',
// // 		cvc_check: 'pass',
// // 		dynamic_last4: null,
// // 		exp_month: 11,
// // 		exp_year: 2023,
// // 		fingerprint: 'zlrB52SIR2bSKOOo',
// // 		funding: 'credit',
// // 		last4: '9364',
// // 		name: 'Reed McFadden'
// // 	}
// // };
// // ref
// // 	.add({
// // 		uid: '13wWlEhD1FbA1D2J9XHrmo6Jk2Q2',
// // 		sum: '3000',
// // 		quantity: '1',
// // 		productId: 'dride-hat',
// // 		token: token
// // 	})
// // 	.then(() => console.log('ok'), error => console.log(error));

// // var params = {
// // 	uid: 'CRD4alk1oRPKZ0eaFM3swg4IbWJ3',
// // 	sum: '14900',
// // 	quantity: '1',
// // 	productId: 'dride-kit',
// // 	amount: '1',
// // 	description: '(1) Dride Zero 3D printed prototype',
// // 	token:
// // 		'{"id":"tok_1CmzO3EuDB8ope0pSzk5sc5Y","object":"token","card":{"id":"card_1CmzO2EuDB8ope0p0syGbTK4","object":"card","address_city":"Vijayawada","address_country":"India","address_line1":"9-25-13","address_line1_check":"unavailable","address_line2":null,"address_state":"02","address_zip":"520001","address_zip_check":"unavailable","brand":"Visa","country":"IN","cvc_check":"pass","dynamic_last4":null,"exp_month":2,"exp_year":2022,"funding":"credit","last4":"7666","metadata":{},"name":"Rama Krishna","tokenization_method":null},"client_ip":"103.44.12.6","created":1531381131,"email":"rajeevkkrishna@gmail.com","livemode":true,"type":"card","used":false}'
// // };

// // var db = admin.firestore();
// // var aTuringRef = db.collection('purchases');

// // var setAlan = aTuringRef
// // 	.add({
// // 		uid: params.uid,
// // 		sum: params.sum,
// // 		quantity: params.quantity,
// // 		productId: params.productId,
// // 		token: JSON.parse(params.token)
// // 	})
// // 	.then(r => console.log('xxx', r), error => console.log('error', error));
