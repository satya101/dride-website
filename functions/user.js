// var admin = require("firebase-admin");

// var serviceAccount = require("./dride-2384f-firebase-adminsdk-m1piu-12d72e0fc3.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://dride-2384f.firebaseio.com"
// });
// var tUser  = null;
// var r  = [];
// var res  = [];

// var db = admin.database();
// var ref = db.ref("userData");


// function listAllUsers(nextPageToken) {
// 	// List batch of users, 1000 at a time.
// 	admin.auth().listUsers(10, nextPageToken)
// 	  .then(function(listUsersResult) {
// 		listUsersResult.users.forEach(function(userRecord) {
// 		  tUser = userRecord.toJSON()
// 		  if (tUser.providerData[0].providerId == 'facebook.com'){
// 			  console.log("user", tUser.uid, tUser.providerData[0].uid);
// 			  r[tUser.uid] = {'fid': tUser.providerData[0].uid, name: tUser.providerData[0].displayName, photoURL: tUser.providerData[0].photoURL}
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