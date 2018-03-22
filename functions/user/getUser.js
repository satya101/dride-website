var admin = require('firebase-admin');

getUser = {
	/*
     * get user details
     */
	getUserByUID: uid => {
		return new Promise((resolve, reject) => {
			admin
				.auth()
				.getUser(uid)
				.then(
					userRecord => {
						resolve(userRecord.toJSON());
					},
					error => {
						reject(error);
					}
				);
		});
	}
};

module.exports = getUser;
