var functions = require('firebase-functions');

// Add updated cmntsCount to threads
exports.cmntsCount = functions.database.ref('/conversations/{threadId}')
    .onWrite(event => {

        if (!event.params.threadId) {
            console.log('not enough data');
            return null;
        }


        event.data.adminRef.root.child("conversations/" + event.params.threadId).once('value').then(function(conversation) {

            event.data.adminRef.root.child("threads/" + event.params.threadId + "/cmntsCount").once('value').then(function(cmntsCount) {



                event.data.adminRef.root.child("threads/" + event.params.threadId + "/cmntsCount").set(conversation.numChildren());

            });
        });


        return event.data.adminRef.root.child('threads').child(event.params.threadId).child('lastUpdate').set((new Date).getTime());



    });


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

    console.log(cloudAnalyserUrl + '?uid=' + uid + '&filename=' + filename);
    var formData = {
      // Pass a simple key-value pair 
      uid: uid,
      filename: filename

    };
    return request.get({url: cloudAnalyserUrl + '?uid=' + uid + '&filename=' + filename}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err + '--' + httpResponse);
      }
      console.log('Upload successful!  Server responded with:', body);
    });
});

