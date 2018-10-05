var admin = require('firebase-admin');

var serviceAccount = require('./appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://dride-2384f.firebaseio.com'
});

var db = admin.firestore();

// db.collection('users')
// 	.where('name', '==', null)
// 	.get()
// 	.then(function(querySnapshot) {
// 		querySnapshot.forEach(function(doc) {
// 			// doc.data() is never undefined for query doc snapshots
// 			console.log(doc.id, ' => ', doc.data());
// 		});
// 	})
// 	.catch(function(error) {
// 		console.log('Error getting documents: ', error);
// 	});

// function getUserDetails(uid) {
// 	return new Promise((resolve, reject) => {
// 		admin
// 			.auth()
// 			.getUser(uid)
// 			.then(function(userRecord) {
// 				// See the UserRecord reference doc for the contents of userRecord.

// 				console.log('Successfully fetched user data:', userRecord.toJSON());
// 				resolve(userRecord.toJSON());
// 			})
// 			.catch(function(error) {
// 				console.log('Error fetching user data:', error);
// 				reject(error);
// 			});
// 	});
// }
