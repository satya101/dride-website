'use strict';

var admin = require('firebase-admin');

var serviceAccount = require('../functions/appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://dride-2384f.firebaseio.com',
	storageBucket: 'dride-2384f.appspot.com'
});

var db = admin.database();

var algoliasearch = require('algoliasearch');

const ALGOLIA_ID = 'S2I95AGWAJ';
const ALGOLIA_ADMIN_KEY = '6afabbfd6a7cb8ba8e624b6faab74e4b';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var dbfs = admin.firestore();

var ref = db.ref('conversations/');

ref.once('value', function(snapshot) {
	snapshot.forEach(function(data) {
		var d = data.val();
		Object.keys(d).forEach(function(key) {
			console.log(d[key]);
			addToFireStore(d[key], data.key, key);
		});
	});
});

function addToAlgolia(data, threadId, conversationId) {
	const post = {
		body: data.body,
		auther: data.auther,
		timestamp: data.timestamp,
		threadId: threadId,
		objectID: conversationId
	};

	// Write to the algolia index
	const index = client.initIndex('forum');
	return index.saveObject(post).then(e => console.log('ok', threadId), e => console.log('bad', e));
}
function addToFireStore(data, threadId, conversationId) {
	dbfs
		.collection('forum')
		.doc(threadId)
		.collection('conversations')
		.doc(conversationId)
		.set(data)
		.then(() => console.log(threadId, 'done'), () => console.log('err'));
}
