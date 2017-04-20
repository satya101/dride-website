var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('eae916fa09f65059630c5ae451682939');



var FCM = require(__dirname + '/FCM/subscribe.js');
var anonymizer = require(__dirname + '/user/anonymizer.js');


/*
 * Add updated cmntsCount to threads & update the description for the thread with the latest post
 */
exports.cmntsCount = functions.database.ref('/conversations/{threadId}/{conversationId}')
    .onWrite(event => {

        if (!event.params.threadId) {
            console.log('not enough data');
            return null;
        }

        // Only process data when it is first created.
        if (event.data.previous.exists()) {
            return;
        }

        return event.data.adminRef.root.child("threads").child(event.params.threadId).child("slug").once('value').then(function(slug) {


            var conv = event.data.val()

            event.data.adminRef.root.child("pushTokens").child(conv.autherId).child('value').once('value').then(function(pushToken) {
                FCM.subscribeUserToTopic(pushToken.val(), slug.val());

                return event.data.adminRef.root.child("conversations").child(event.params.threadId).once('value').then(function(conversation) {

                    //dispatch notifications
                    FCM.sendToTopic(slug.val(), pushToken.val());
                    
                    var resObj = {
                        cmntsCount: conversation.numChildren(),
                        description: conv.body
                    }
                    if (conversation.numChildren() > 1 ) delete resObj['description'];

                    return event.data.adminRef.root.child("threads").child(event.params.threadId).update(resObj);

                });


                return event.data.adminRef.root.child('threads').child(event.params.threadId).child('lastUpdate').set((new Date).getTime());

            });


           
        });
    });
/*
 * Add updated cmntsCount to clips
 */
exports.cmntsCountVideo = functions.database.ref('/conversations_video/{uid}/{videId}/{conversationId}')
    .onWrite(event => {

        if (!event.params.videId || !event.params.uid || !event.params.conversationId) {
            console.log('not enough data');
            return null;
        }


        event.data.adminRef.root.child("conversations_video/" + event.params.uid + '/' + event.params.videId).once('value').then(function(conversationVideo) {

            event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/cmntsCount").set(conversationVideo.numChildren());
            var r = {}
            r[event.params.conversationId] = event.data.val()
            event.data.adminRef.root.child("clips/" + event.params.uid + '/' + event.params.videId + "/comments").set(r);

        });


        return event.data.adminRef.root.child('clips').child(event.params.uid).child(event.params.videId).child('lastUpdate').set((new Date).getTime());



    });


/*
*   Save users data upon register
*/
exports.saveNewUserData = functions.auth.user().onCreate(event => {


    const user = event.data; // The Firebase user.
    var usersRef = admin.database().ref("userData").child(event.data.uid);

    return usersRef.set({
            'name': user.displayName,
            'pic': user.photoURL
        }).then(function(){
            // create a user in Mixpanel Engage
            mixpanel.people.set(user.displayName, {
                $first_name: user.displayName.split(' ')[0],
                $last_name: user.displayName.split(' ')[1],
                $created: (new Date()).toISOString(),
                email: user.email,
                distinct_id: event.data.uid
            });


        });
    

});

/*
 * Anonymise a user upon request
 */
exports.anonymizer = functions.database.ref('/userData/{uid}/anonymous')
    .onWrite(event => {

        if (!event.params.uid) {
            console.log('not enough data');
            return null;
        }
        var anonymStatus = event.data.val()

        return anonymizer.start(anonymStatus, event.params.uid)

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

exports.generateThumbnail = functions.storage.object().onChange(event => {

    // Exit if this is triggered on a file that is not an image.
    if (!event.data.contentType.startsWith('video/')) {
        console.log('This is not an video.');
        return;
    }
    // Exit if this is a move or deletion event.
    if (event.data.resourceState === 'not_exists') {
        console.log('This is a deletion event.');
        return;
    }

    //find uid & timestamp from filename
    n = event.data.name.split('/');
    uid = n[1];
    filename = n[2];

    var cloudAnalyserUrl = 'http://54.246.250.130:9000/api/getThumb';

    var formData = {
        // Pass a simple key-value pair 
        uid: uid,
        filename: filename

    };
    return request.get({ url: cloudAnalyserUrl + '?uid=' + uid + '&filename=' + filename }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err + '--' + httpResponse);
        }
        console.log('Upload successful!  Server responded with:', body);
    });

});







