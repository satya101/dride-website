// var functions = require('firebase-functions');

// // Add updated cmntsCount to threads
// exports.findUrls = functions.database.ref('/conversations/{threadId}/{conversationId}/body')
// 					    .onWrite(event => {
		

//       const original = event.data.val();

//       const urls = getUrls(original);
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return event.data.ref.parent.child('uppercase').set(uppercase);

// });

