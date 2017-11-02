var admin = require('firebase-admin');
var gcs = require('@google-cloud/storage')();

// var serviceAccount = require("../appEngine/dride-2384f-firebase-adminsdk-5lgyf-da8f444645.json");
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: "https://dride-2384f.firebaseio.com",
// 	storageBucket: "dride-2384f.appspot.com"
//   });

cloud = {
    /*
     * delete the video from a user profile, all it's comments and remove from HP.
     */
    remvoeClip: function(videoId, uid) {



            var db = admin.database();
            var refClip = db.ref("clips").child(uid).child(videoId)
            return refClip.once("value", function(snapshot) {

                var clipObj = snapshot.val()

                //remove from HP if needed
                if (clipObj && clipObj.hpRef){
                    var ref = db.ref("clips_homepage").child(clipObj.hpRef)
                    ref.remove()
                }


                //remove the clip
                var ref = db.ref("clips").child(uid).child(videoId)
                ref.remove()

                //remove video comments
                var ref = db.ref("conversations_video").child(uid).child(videoId)
                ref.remove()

                //remove clips from hosting
                var bucket = gcs.bucket('dride-2384f.appspot.com');
                bucket.deleteFiles({ prefix: 'clips/' + uid + '/' + videoId + '.mp4' }, function(err) { console.log(err) })
                bucket.deleteFiles({ prefix: 'thumbs/' + uid + '/' + videoId + '.jpg' }, function(err) { console.log(err) })
                bucket.deleteFiles({ prefix: 'gps/' + uid + '/' + videoId + '.json' }, function(err) { console.log(err) })




            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });



    },
    /*
     * copy the video to HP
     */
    copyToHP: function(videoId, uid, clip, hpRef) {

        var db = admin.database();
        var ref = db.ref("clips_homepage")
        clip.op = uid;
        clip.videoId = videoId;
        clip.hpInsertTime = (new Date()).getTime() + '';
        
        if (typeof hpRef === 'undefined'){
			console.log('add hp ref')
            var HpInsertedId = ref.push(clip).key

            //add ref to clips/{uid}/{videoId}
            var clipRef = db.ref("clips").child(uid).child(videoId)
            //add op to the object 
            clipRef.update({'hpRef': HpInsertedId})
        }else{
			console.log('update views or whatever')
            var clipRef = db.ref("clips_homepage").child(hpRef)
            clipRef.update(clip)
        }
    },


	isProcessed(uid, videoId){
		return new Promise((resolve, reject) => {
			var db = admin.database();
			db.ref('clips').child(uid).child(videoId).once("value", (snapshot) =>{
				const clip = snapshot.val();
					resolve(clip.processed);
			})
		})
	}

}

module.exports = cloud;
