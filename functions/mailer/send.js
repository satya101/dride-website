var admin = require('firebase-admin');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('gAfP29xLRGG6RoVW2Sx5KA');
var marked = require('marked');

mailer = {


    /*
     * Subscribe user to a topic
     */
    subscribeUserToTopic: function(autherId, topicId) {


            admin.auth().getUser(autherId)
              .then(function(userRecord) {

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
    sendToTopic: function(threadId, topicId, conv) {

        var db = admin.database();

        var threadRef = db.ref("threads").child(threadId);

        threadRef.once("value", function(threadSnap) {
        var thread = threadSnap.val()

            var sendObj = {
				"template_name": 'update-user',
                "topicURL": "https://dride.io/thread/" + topicId,
                "fname": conv.auther,
                "title": thread.title,
                "subject": thread.title,
                "cmntCount": thread.cmntCount,
                "body": marked(conv.body), //limit & remove html 
                "profilePic": conv.pic, 
                "timestamp": conv.timestamp,
                "type": 'forum',
                "to" : [],
                "tags": ['forum comment'],
				"global_merge_vars": [
										{
											"name": "FULL_NAME",
											"content": conv.auther
										},
										{
											"name": "TITLE",
											"content": thread.title
										},
										{
											"name": "PROFILE_PIC",
											"content": conv.pic
										},
										{
											"name": "BODY",
											"content": marked(conv.body)
										},
										{
											"name": "TOPIC_URL",
											"content": "https://dride.io/thread/" + topicId
										},
										{
											"name": "TYPE",
											"content": 'forum'
										}
									]
            };

            //update subscribers on a new post


            //get subscribers email's
            var topicRef = db.ref("topics").child(topicId);

            //get subscribers email's
            topicRef.once("value", function(topicSubscribersSnap) {
            var t_SendTo = topicSubscribersSnap.val()
           

            var res = [];
             for (var opUID in t_SendTo) {
                //exclude self
                if (opUID != conv.autherId)
                    sendObj.to.push( {'email': t_SendTo[opUID].email} )
             }

             if (sendObj.subject)
                mailer.send(sendObj);

            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            })

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });


    },
    send: function(sendObj) {


        var template_name = sendObj.template_name;
        var template_content = [];

        var message = {
            "subject": sendObj.subject,
            "from_email": "hello@dride.io",
            "from_name": "Dride",
            "to": sendObj.to,
            "headers": {
                "Reply-To": "hellp@dride.io"
            },
            "important": false,
            "track_opens": null,
            "track_clicks": true,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": null,
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null,
            "merge": true,
            "merge_language": "mailchimp",
            "global_merge_vars": sendObj.global_merge_vars,

            "tags": sendObj.tags,
            "google_analytics_domains": [
                "dride.io"
            ],
            "metadata": {
                "website": "www.dride.io"
            }
        };
        var async = false;
        var ip_pool = "Main Pool";
        mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            console.log(result);
        }, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    }



}


module.exports = mailer;
