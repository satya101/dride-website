var Thumbler = require('thumbler');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('ffmpeg');


var fs = require('fs');
var admin = require("firebase-admin");

module.exports = class VideoEditor {
  constructor(uid, filename, path) {
    this.uid = uid;
    this.filename = filename;
    this.path = path;

  }

  prepareVideoToCloud() {
    return new Promise((resolve, reject) => {
      this.resizeVideo().then(
        done => {
          console.log('resizeVideo')
          this.addWaterMark().then(done => {
            console.log('addWaterMark')
            this.saveThumbNail().then(
              done => {
                console.log('saveThumbNail')
                resolve();
              }, fail => {
                reject(fail)
              })

          }, fail => {
            reject(fail)
          })


        }, fail => {
          reject(fail)
        }
      )
    });
  }

  //add  watermark
  addWaterMark() {
    return new Promise((resolve, reject) => {

      var process = new ffmpeg(this.path + this.uid + '_resized_' + this.filename);
      process.then((video) => {
        var watermarkPath = __dirname + '/../stripe.png',
          newFilepath = this.path + this.uid + '_' + this.filename,
          settings = {
            position: "NE" // Position: NE NC NW SE SC SW C CE CW
              ,
            margin_nord: null // Margin nord
              ,
            margin_sud: null // Margin sud
              ,
            margin_east: null // Margin east
              ,
            margin_west: null // Margin west
          };
        var callback = (error, files) => {
          if (error) {
            reject(error)
          } else {
            resolve(files);
          }
        }
        //add watermark
        video
          .fnAddWatermark(watermarkPath, newFilepath, settings, callback)


      }, (err) => {
        reject(err)
      });

    })
  }
  //resize video
  resizeVideo() {
    console.log('resizinggggVideo')
    return new Promise((resolve, reject) => {
      var process = new ffmpeg(this.path + this.uid + '__' + this.filename);
      process.then((video) => {
        //add watermark
        video
          .setVideoSize('1080x608', true, true, '#333333')
          //.setAudioCodec('mpeg4')
          .save(this.path + this.uid + '_resized_' + this.filename, (error, file) => {
            if (!error) {
              resolve()
            } else {
              reject(error)
            }
          })




      }, (err) => {
        console.log(err)
        reject(err)
      });

    })
  }

  saveThumbNail() {
    return new Promise((resolve, reject) => {
      const fileNameWithoutExtension = this.filename.split('.')[0]
      var process = new ffmpeg(this.path + this.uid + '_' + this.filename);
      process.then((video) => {
        //add watermark
        video
          .fnExtractFrameToJPG(this.path + this.uid + '_' + fileNameWithoutExtension, {
            frame_rate: 1,
            start_time: 0,
            number: 1,
            size: '1080x608',
            keep_aspect_ratio: false,
            file_name: this.path + this.uid + '_' + fileNameWithoutExtension
          }, (error, file) => {

            if (!error) {
              resolve()
            } else {
              reject(error)
            }
          })

      }, (err) => {
        reject(err)
      });



    })
  }


  //upload files
  uploadToBucket(file, destination) {

    const bucket = admin.storage().bucket();
    console.log(destination + '>>')
    console.log(file + '>>')
    return new Promise((resolve, reject) => {
      bucket.upload(file, {
        destination: destination
      }).then(
        data => {
          console.log(destination + '<<')
          resolve()
        }, err => {
          console.error('uploadToBucket')
          console.error(err)
          reject(err);
        })
    })
  }

}
