var admin = require('firebase-admin');
const cors = require('cors')({origin: true});


var Mailchimp = require('mailchimp-api-v3')
var marked = require('marked');

var env = require('../environments/environments.prod.js').env;



var mailchimp = new Mailchimp(
							  env.mailchimp
							 );


subscriber = {


    /*
     * Subscribe user to a the mailing list
     */
    subscribeUser: function(email) {

		return mailchimp.post({
			path : '/lists/a0b1ee944d/members',
			body : {
				"email_address": email,
				"status": "subscribed"
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
