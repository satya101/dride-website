// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	firebase: {
		apiKey: 'AIzaSyCNxGoKpeyo2HwNjkKQj9G2QWIqLtK_-oc',
		authDomain: 'dride-ci.firebaseapp.com',
		databaseURL: 'https://dride-ci.firebaseio.com',
		projectId: 'dride-ci',
		storageBucket: 'dride-ci.appspot.com',
		messagingSenderId: '846803975515'
	},
	googleMapsApi: 'AIzaSyD_9g0R-z2-NpCQpiQrFrJ7_NzWK6rRyRM',
	functionsURL: 'https://us-central1-dride-2384f.cloudfunctions.net'

};


