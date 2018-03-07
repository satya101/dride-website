var admin = require('firebase-admin');
var env = require('../environments/environment.prod')
var htmlToText = require('html-to-text');
var fs = require('fs');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(env.environment.sendGrid);
var marked = require('marked');

mailer = {


  /*
   * Subscribe user to a topic
   */
  subscribeUserToTopic: function (autherId, topicId) {


    admin.auth().getUser(autherId)
      .then(function (userRecord) {

        var db = admin.database();
        var topicRef = db.ref("topics").child(topicId).child(autherId).set({
          "email": userRecord.email,
          "uid": autherId
        });

      })
  },
  /*
   * Send mails to all subscribers
   */
  sendToTopic: function (threadId, topicId, conv) {

    var db = admin.database();

    var threadRef = db.ref("threads").child(threadId);

    threadRef.once("value", function (threadSnap) {
      var thread = threadSnap.val()
      var template = fs.readFileSync('./mailer/templates/updateUser.mail', "utf8");
      params = {
        "TOPIC_URL": "https://dride.io/thread/" + topicId,
        "FULL_NAME": conv.auther,
        "TITLE": thread.title,
        "PROFILE_PIC": conv.pic,
        "BODY": marked(conv.body),
        "TYPE": "forum",
        "template_name": 'update-user',
        "SUBJECT": thread.title,
        "cmntCount": thread.cmntCount,
        "timestamp": conv.timestamp,
        "to": [],
      }
      template = mailer.replaceParams(params, template)

      const sendObj = {
        to: [],
        from: 'hello@dride.io',
        subject: thread.title,
        text: htmlToText.fromString(template),
        html: template,
        sendMultiple: true
      };


      //update subscribers on a new post


      //get subscribers email's
      var topicRef = db.ref("topics").child(topicId);

      //get subscribers email's
      topicRef.once("value", function (topicSubscribersSnap) {
        var t_SendTo = topicSubscribersSnap.val()


        var res = [];
        for (var opUID in t_SendTo) {
          //exclude self
          if (opUID != conv.autherId) {
            if (sendObj.subject) {
              sendObj.to = (t_SendTo[opUID].email)
              mailer.send(sendObj);
            }
          }

        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      })

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


  },
  send: function (sendObj) {

    sgMail.send(sendObj).then(
      done => console.log('done'),
      err => console.log('err', err)
    );

  },
  replaceParams: function (params, template) {

    Object.keys(params).forEach(function (key) {
      template = template.replace(new RegExp('\\*\\|' + key + '\\|\\*', 'g'), params[key])
    });

    return template;

  }



}


module.exports = mailer;
