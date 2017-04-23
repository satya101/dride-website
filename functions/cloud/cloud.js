var admin = require('firebase-admin');
var gcs = require('@google-cloud/storage')();

cloud = {
    /*
     * delete the video from a user profile, all it's comments and remove from HP.
     */
    remvoeClip: function(videoId, uid) {


            //remove clips from hosting
            var bucket = gcs.bucket('dride-2384f.appspot.com');
            bucket.deleteFiles({ prefix: 'clips/'+uid+'/'+videoId+'.mp4' }, function(err) { console.log(err)})
            bucket.deleteFiles({ prefix: 'thumbs/'+uid+'/'+videoId+'.jpg' }, function(err) {console.log(err)})
            bucket.deleteFiles({ prefix: 'gps/'+uid+'/'+videoId+'.json' }, function(err) {console.log(err)})


            // storageRef.child('clips').child(uid).child(videoId + '.mp4').delete()
            // storageRef.child('thumbs').child(uid).child(videoId + '.jpg').delete()
            // storageRef.child('gps').child(uid).child(videoId + '.json').delete()


            //remove the clip
            var db = admin.database();
            var ref = db.ref("clips").child(uid).child(videoId)
            ref.remove()

            //remove video comments
            var db = admin.database();
            var ref = db.ref("conversations_video").child(uid).child(videoId)
            ref.remove()


            //remove from HP if needed
            // TODO: ...

            return true;


    },
    /*
     * move the video to HP
     */
    moveToHP: function(videoId, uid) {

        console.log('hp')

    }


}

module.exports = cloud;
