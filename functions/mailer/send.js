
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('gAfP29xLRGG6RoVW2Sx5KA');

mailer = {
    /*
     * Subscribe user to a topic
     */
    send: function(sendObj) {


        var template_name = "update-user";
        var template_content = [{
                "TITLE": "example name",
                "NAME": "example content"
            }];


        var message = {
            "subject": "example subject",
            "from_email": "hello@dride.io",
            "from_name": "Dride",
            "to": [{
                    "email": "saoron@gmail.com",
                    "name": "Recipient Name",
                    "type": "to"
                }],
            "headers": {
                "Reply-To": "message.reply@example.com"
            },
            "important": false,
            "track_opens": null,
            "track_clicks": null,
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
            "global_merge_vars": [
                                {
                                    "name": "FULL_NAME",
                                    "content": sendObj.fname
                                },
                                {
                                    "name": "TITLE",
                                    "content": sendObj.title
                                },
                                {
                                    "name": "PROFILE_PIC",
                                    "content": sendObj.profilePic
                                },
                                {
                                    "name": "BODY",
                                    "content": sendObj.body
                                },
                                {
                                    "name": "TOPIC_URL",
                                    "content": sendObj.topicURL
                                },
                                {
                                    "name": "TYPE",
                                    "content": sendObj.type
                                }
                                ],

            "tags": [
                "password-resets"
            ],
            "google_analytics_domains": [
                "example.com"
            ],
            "google_analytics_campaign": "message.from_email@example.com",
            "metadata": {
                "website": "www.example.com"
            },
            "recipient_metadata": [{
                    "rcpt": "recipient.email@example.com",
                    "values": {
                        "user_id": 123456
                    }
                }]
        };
        var async = false;
        var ip_pool = "Main Pool";
        var send_at = "example send_at";
        mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            console.log(result);
            /*
            [{
                    "email": "recipient.email@example.com",
                    "status": "sent",
                    "reject_reason": "hard-bounce",
                    "_id": "abc123abc123abc123abc123abc123"
                }]
            */
        }, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });
    }



}


module.exports = mailer;
