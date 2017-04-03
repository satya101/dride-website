
// const functions = require('firebase-functions');
// const mkdirp = require('mkdirp-promise');
// const gcs = require('@google-cloud/storage')();
// const spawn = require('child-process-promise').spawn;
// const LOCAL_TMP_FOLDER = '/tmp/';

// // Max height and width of the thumbnail in pixels.
// const THUMB_MAX_HEIGHT = 640;
// const THUMB_MAX_WIDTH = 480;
// // Thumbnail prefix added to file names.
// const THUMB_PREFIX = 'thumb_';


// exports.generateThumbnail = functions.storage.object().onChange(event => {
//   const filePath = event.data.name;
//   const filePathSplit = filePath.split('/');
//   const fileName = filePathSplit.pop();
//   const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
//   const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
//   const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
//   const tempLocalFile = `${tempLocalDir}${fileName}`;
//   const tempLocalThumbFile = `${LOCAL_TMP_FOLDER}${thumbFilePath}`;

//   // Exit if this is triggered on a file that is not an image.
//   if (!event.data.contentType.startsWith('image/')) {
//     console.log('This is not an image.');
//     return;
//   }

//   // Exit if this is a move or deletion event.
//   if (event.data.resourceState === 'not_exists') {
//     console.log('This is a deletion event.');
//     return;
//   }

//   // Create the temp directory where the storage file will be downloaded.
//   return mkdirp(tempLocalDir).then(() => {
//     // Download file from bucket.
//     const bucket = gcs.bucket(event.data.bucket);
//     return bucket.file(filePath).download({
//       destination: tempLocalFile
//     }).then(() => {
//       console.log('The file has been downloaded to', tempLocalFile);
//       // Generate a thumbnail using ImageMagick.
//       return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile]).then(() => {
//         console.log('Thumbnail created at', tempLocalThumbFile);
//         // Uploading the Thumbnail.
// 		return thumbler.extract(tempLocalFile, tempLocalThumbFile, '00:00:01', '640x480', function(){
			
// 			console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:00');


// 			return bucket.upload(tempLocalThumbFile, {
// 	          destination: thumbFilePath
// 	        }).then(() => {
// 	          console.log('Thumbnail uploaded to Storage at', thumbFilePath);
// 	        });


// 		});

//       });
//     });
//   });












// });