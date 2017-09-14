var admin = require('firebase-admin');
const cors = require('cors')({origin: true});


var Mailchimp = require('mailchimp-api-v3')
var marked = require('marked');
var env = require('../environments/environment.prod')

var mailchimp = new Mailchimp(env.environment.mailchimp);


subscriber = {


    /*
     * Subscribe user to a the mailing list
     */
    subscribeUser: function(email, user) {

		if (!user.displayName)
			user.displayName = ''
			
		return mailchimp.post({
			path : '/lists/a0b1ee944d/members',
			body : {
				"email_address": email,
				"status": "subscribed",
				"merge_fields": {
					"FNAME": user.displayName.split(' ')[0],
					"LNAME": user.displayName.split(' ')[1]
				}
			}
			}).then((results) =>{
				return 1;
			})
			.catch((err) =>{
				console.log(err)
				return -1;
			})


    }

}


module.exports = subscriber;
