var env = require('./environments/environment.prod.js')
var fs = require('fs');
var htmlToText = require('html-to-text');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(env.environment.sendGrid);

var template = fs.readFileSync('./mailer/templates/updateUser.mail', "utf8");



  params = {
	"TOPIC_URL": "https://dride.io/thread/",
	"FULL_NAME": "x232xx",
	"TITLE": "xx35788x",
	"PROFILE_PIC": "https://lh6.googleusercontent.com/-T56IEEgxV28/AAAAAAAAAAI/AAAAAAAAACM/19yAH9uu5uA/s96-c/photo.jpg",
	"BODY": "xx5434543543n5643564645654x",
	"TYPE": "forum",
	"template_name": 'update-user',
	"SUBJECT": "xx54345x",
	"cmntCount": "x4xx",
	"timestamp": "x56454xx",
	"to" : [],
}

template = replaceParams(params, template)

const msg = {
	to: 'yossi@dride.io',
	from: 'hello@dride.io',
	subject: 'xx',
	text: 'and easy to do anywhere, even with Node.js',
	html: template,
  };



  sgMail.send(msg);





 function replaceParams(params, template) {

	Object.keys(params).forEach(function(key) {
		template = template.replace(new RegExp('\\*\\|'+key+'\\|\\*', 'g'), params[key])
	});

	return template;

}