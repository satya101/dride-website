// //var functions = require('firebase-functions');

// var thumbler = require('video-thumb');
// var http = require('https');
// var fs = require('fs');
// var  gcs = require('@google-cloud/storage')();


// var file = fs.createWriteStream("file.mp4");
// var clipURL = 'https://firebasestorage.googleapis.com/v0/b/dride-2384f.appspot.com/o/clips%2F40qmIeGnJqdn3rBT9pUSVJIcc6w1%2F1490881644639.MP4?alt=media&token=e32a7a18-cd18-4e05-89e0-b0267b59c129';
// var request = http.get(clipURL, function(response) {
//   response.pipe(file);
//   file.on('finish', function() {

// 		thumbler.extract('file.mp4', 'snapshot.png', '00:00:01', '640x480', function(){
			
// 			console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:00');

// 		});


//     });

// });


