var functions = require('firebase-functions');
var admin = require('firebase-admin');
var request = require('request');
var path = require('path');
var http = require('http');
var cors = require('cors')({
    origin: true
});
admin.initializeApp(functions.config().firebase);
// grab the Mixpanel factory
var Mixpanel = require('mixpanel');
// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('eae916fa09f65059630c5ae451682939');
var FCM = require(__dirname + '/FCM/subscribe.js');
var mailer = require(__dirname + '/mailer/send.js');
var subscriber = require(__dirname + '/mailer/subscribe.js');
var anonymizer = require(__dirname + '/user/anonymizer.js');
var cloud = require(__dirname + '/cloud/cloud.js');
var viewCounter = require(__dirname + '/cloud/viewCount.js');
/*
*	HTTP endpoint to subscribe a user to mailing list
*/
exports.subscriber = functions.https.onRequest(function (req, res) {
    var r = (req.query.email) ? {
        'status': subscriber.subscribeUser(req.query.email, {})
    } : {
        'status': -1
    };
    cors(req, res, function () {
        res.status(200).send(r);
    });
});
/*
*	HTTP endpoint to increase views counter
*/
exports.viewCounter = functions.https.onRequest(function (req, res) {
    viewCounter.addView(req.query).then(function () {
        cors(req, res, function () {
            res.status(200).send({ 'status': 1 });
        });
    }, function (err) {
        cors(req, res, function () {
            res.status(200).send({ 'status': -1 });
        });
    });
});
/*
 * Add updated cmntsCount to threads & update the description for the thread with the latest post
 */
exports.cmntsCount = functions.database.ref('/conversations/{threadId}/{conversationId}')
    .onWrite(function (event) {
    if (!event.params.threadId) {
        console.log('not enough data');
        return null;
    }
    // Only process data when it is first created.
    if (event.data.previous.exists()) {
        return;
    }
    return event.data.adminRef.root.child("threads").child(event.params.threadId).child("slug").once('value').then(function (slug) {
        var conv = event.data.val();
        event.data.adminRef.root.child("pushTokens").child(conv.autherId).child('value').once('value').then(function (pushToken) {
            FCM.subscribeUserToTopic(pushToken.val(), slug.val());
            mailer.subscribeUserToTopic(conv.autherId, event.params.threadId);
            return event.data.adminRef.root.child("conversations").child(event.params.threadId).once('value').then(function (conversation) {
                //dispatch notifications
                FCM.sendToTopic(slug.val(), pushToken.val());
                //dispatch email
                mailer.sendToTopic(event.params.threadId, event.params.threadId, conv);
                var resObj = {
                    cmntsCount: conversation.numChildren(),
                    description: conv.body
                };
                if (conversation.numChildren() > 1)
                    delete resObj['description'];
                return event.data.adminRef.root.child("threads").child(event.params.threadId).update(resObj);
            });
        });
    });
});
/*
 * Add updated cmntsCount to clips
 */
exports.cmntsCountVideo = functions.database.ref('/conversations_video/{uid}/{videId}/{conversationId}')
    .onWrite(function (event) {
    if (!event.params.videId || !event.params.uid || !event.params.conversationId) {
        console.log('not enough data');
        return null;
    }
    event.data.adminRef.root.child("conversations_video/" + event.params.uid + '/' + event.params.videId).once('value').then(function (conversationVideo) {
        event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/cmntsCount").set(conversationVideo.numChildren());
        var r = {};
        r[event.params.conversationId] = event.data.val();
        event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/comments").set(r);
    });
    return event.data.adminRef.root.child('clips').child(event.params.uid).child(event.params.videId).child('lastUpdate').set((new Date).getTime());
});
/*
 *   Save users data upon register
 */
exports.saveNewUserData = functions.auth.user().onCreate(function (event) {
    var user = event.data; // The Firebase user.
    var usersRef = admin.database().ref("userData").child(event.data.uid);
    if (!user.displayName)
        user.displayName = 'Rider' + anonymizer.getRandomArbitrary(1, 500);
    var resObj = {
        'name': user.displayName,
        'photoURL': user.photoURL ? user.photoURL : 'https://storage.cloud.google.com/dride-2384f.appspot.com/assets/profilePic/pic' + anonymizer.getRandomArbitrary(1, 5) + '.png'
    };
    if (user.providerData[0].providerId == 'facebook.com') {
        resObj['fid'] = user.providerData[0].uid;
    }
    return usersRef.set(resObj).then(function () {
        // create a user in Mixpanel Engage
        mixpanel.people.set(user.displayName, {
            $first_name: user.displayName.split(' ')[0],
            $last_name: user.displayName.split(' ')[1],
            $created: (new Date()).toISOString(),
            email: user.email,
            distinct_id: event.data.uid
        });
        //subscribe to mailchimp
        subscriber.subscribeUser(user.email, user);
    });
});
/*
 * Anonymise a user upon request
 */
exports.anonymizer = functions.database.ref('/userData/{uid}/anonymous')
    .onWrite(function (event) {
    if (!event.params.uid) {
        console.log('not enough data');
        return null;
    }
    var anonymStatus = event.data.val();
    return anonymizer.start(anonymStatus, event.params.uid);
});
/*
 * remove clips on event
 */
exports.deleteVideo = functions.database.ref('/clips/{uid}/{videoId}/deleted')
    .onWrite(function (event) {
    if (!event.params.uid || !event.params.videoId) {
        console.log('not enough data');
        return null;
    }
    var clipDeleteStatus = event.data.val();
    if (clipDeleteStatus)
        return cloud.remvoeClip(event.params.videoId, event.params.uid);
});
/*
 * move clip to the homePage
 */
exports.copyToHP = functions.database.ref('/clips/{uid}/{videoId}')
    .onWrite(function (event) {
    // Exit when the data is deleted.
    if (!event.data.exists()) {
        return;
    }
    if (!event.params.uid || !event.params.videoId) {
        console.log('not enough data');
        return null;
    }
    console.log('copy ' + event.params.videoId);
    var clip = event.data.val();
    if (clip.homepage)
        return cloud.copyToHP(event.params.videoId, event.params.uid, clip, clip.hpRef);
});
// /*
//  * push clip to HP if marked as HP ready
//  */
// exports.populateHP = functions.database.ref('/HPclips/{videId}/')
//     .onWrite(event => {
//         if (!event.params.videId) {
//             console.log('not enough data');
//             return null;
//         }
//         console.log(event.data);
//         // event.data.adminRef.root.child("clips/" + event.params.videId + '/' + event.params.videId).once('value').then(function(conversationVideo) {
//         //     event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/cmntsCount").set(conversationVideo.numChildren());
//         //     var r = {}
//         //     r[event.params.conversationId] = event.data.val()
//         //     event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/comments").set(r);
//         // });
//         //return event.data.adminRef.root.child('clips').child(event.params.uid).child(event.params.videId).child('lastUpdate').set((new Date).getTime());
//     });
/*
 *   Call cloud-analyser to push new thumbnail and CV extracted data to DB.
 */
var gcs = require('@google-cloud/storage')();
var request = require('request');
exports.generateThumbnail = functions.storage.object().onChange(function (event) {
    // Exit if this is triggered on a file that is not an image.
    if (!event.data.contentType.startsWith('video/')) {
        console.log('This is not an video.');
        return;
    }
    // Exit if this is a move or deletion event.
    console.log(event.data.resourceState);
    if (event.data.resourceState === 'not_exists') {
        console.log('This is a deletion event.');
        return;
    }
    // find uid & timestamp from filename
    n = event.data.name.split('/');
    uid = n[1];
    filename = n[2];
    var cloudAnalyserUrl = 'http://54.246.250.130:9000/api/getThumb';
    var formData = {
        // Pass a simple key-value pair
        uid: uid,
        filename: filename
    };
    return request.get({
        url: cloudAnalyserUrl + '?uid=' + uid + '&filename=' + filename
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err + '--' + httpResponse);
        }
        console.log('Upload successful!  Server responded with:', body);
        //track event
        mixpanel.track('video_upoload', {
            distinct_id: uid,
            filename: filename
        });
        //notify user his video is live!
        var db = admin.database();
        admin.auth().getUser(uid).then(function (userRecord) {
            db.ref('clips').child(uid).child(filename.split('.')[0]).once("value", function (snapshot) {
                var user = userRecord.toJSON();
                var clip = snapshot.val();
                console.log(user);
                //notify user his video is live!
                var sendObj = {
                    "template_name": 'video-is-on',
                    "subject": "Your video is now on Dride Cloud",
                    "to": [{
                            "email": user.email
                        },
                        {
                            "email": 'yossi@dride.io'
                        },
                    ],
                    "tags": ['video uploaded!'],
                    "global_merge_vars": [{
                            "name": "FULL_NAME",
                            "content": user.displayName.split(' ')[0]
                        },
                        {
                            "name": "VIDEO_POSTER",
                            "content": clip.thumbs.src
                        },
                        {
                            "name": "VIDEO_LINK",
                            "content": 'https://dride.io/profile/' + uid + '/' + filename.split('.')[0]
                        }
                    ]
                };
                mailer.send(sendObj);
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }, function (errorObject) {
            console.log("Error fetching user data: " + errorObject.code);
        });
    });
});




exports.metaService = functions.https.onRequest((req, res) => {

	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');	
	var userAgent = req.headers['user-agent'];
	
	if (
		userAgent.indexOf('facebookexternalhit') !== -1 ||
		userAgent.indexOf('WhatsApp') !== -1 ||
		userAgent.indexOf('Facebot') !== -1 ||
		userAgent.indexOf('Twitterbot') !== -1 ||
		userAgent.indexOf('bingbot') !== -1 ||
		userAgent.indexOf('msnbot') !== -1 ||
		userAgent.indexOf('YandexBot') !== -1 ||
		userAgent.indexOf('vkShare') !== -1 ||
		userAgent.indexOf('XML Sitemaps Generator') !== -1

		) {
			//send SSR content
			request('http://54.229.224.51:4000/' + req.originalUrl, function (error, response, body) {
				res.status(200).send( body );
			  });
		  
	}else{
		res.status(200).sendFile( path.resolve('dist/index.html') );
	}
	

});