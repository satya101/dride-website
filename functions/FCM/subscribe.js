var admin = require('firebase-admin');


FCM = {
    /*
     * Subscribe user to a topic
     */
    subscribeUserToTopic: function(registrationToken, topic) {

        if (!registrationToken)
            return;

        // Subscribe the poster to the topic
        var cleanTopic = topic.replace('a-zA-Z0-9-_.~%', '');
        admin.messaging().subscribeToTopic(registrationToken, cleanTopic).then(function(){
            console.log('unsubscribed: ' + registrationToken)
        });

    },

    /*
     * send a post to a topic
     */
    sendToTopic: function(topic, initiaterToken) {


        var payload = {
            notification: {
                title: "A new post",
                body: "Someone just posted a comment on a thread you've participating in.",
                click_action: "https://dride.io/thread/" + topic,
                icon: '/images/pwa/icon-144x144.png'
            }
        };


        //update subscribers on a new post
        var cleanTopic = topic.replace('a-zA-Z0-9-_.~%', '');


        //un-subscribe OP from topic
        if (!initiaterToken) initiaterToken = '-';
        
        admin.messaging().unsubscribeFromTopic(initiaterToken, cleanTopic)
          .then(function(response) {
            console.log('unsubscribed: ' + initiaterToken)
            console.log('topic: ' + cleanTopic)
                admin.messaging().sendToTopic(cleanTopic, payload)
                    .then(function(response) {
                        // See the MessagingDevicesResponse reference documentation for
                        // the contents of response.
                        console.log("Successfully sent message:", response);
                        //re-subscribe user to the topic
                        FCM.subscribeUserToTopic(initiaterToken, cleanTopic)
                    })
                    .catch(function(error) {
                        console.log("Error sending message:", error);
                    });
          })


    }


}

module.exports = FCM;
